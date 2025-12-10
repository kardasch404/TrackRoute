import { ITripRepository } from '../repositories/trip.repository';
import { CreateTripDto } from '../dto/create-trip.dto';
import { UpdateTripDto } from '../dto/update-trip.dto';
import { ValidationException } from '../../../shared/exceptions/validation.exception';
import { NotFoundException } from '../../../shared/exceptions/not-found.exception';
import { ForbiddenException } from '../../../shared/exceptions/forbidden.exception';
import { TripStatus, TruckStatus, TrailerStatus, TireStatus, VehicleType } from '../../../shared/constants/status.constant';
import { UserRole } from '../../../shared/constants/roles.constant';
import { UserModel } from '../../../database/models/user.model';
import { TruckModel } from '../../../database/models/truck.model';
import { TrailerModel } from '../../../database/models/trailer.model';
import { TireModel } from '../../../database/models/tire.model';
import { MaintenanceModel } from '../../../database/models/maintenance.model';
import { TripModel } from '../../../database/models/trip.model';

// Minimum required remaining tire life (in km)
const MIN_REQUIRED_TIRE_DISTANCE = 1000;
// Minimum required remaining distance before maintenance (in km)
const MIN_REQUIRED_MAINTENANCE_DISTANCE = 500;

export class TripService {
  constructor(private readonly tripRepository: ITripRepository) {}

  async createTrip(data: CreateTripDto, currentUserId: string) {
    // Check if trip code already exists
    const existing = await this.tripRepository.findByCode(data.code);
    if (existing) {
      throw new ValidationException('Trip with this code already exists');
    }

    // Validation 1: Admin check
    const currentUser = await UserModel.findById(currentUserId);
    if (!currentUser) {
      throw new NotFoundException('Current user not found');
    }
    if (currentUser.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only ADMIN can assign trips');
    }

    // Validation 2: Driver validity check
    const driver = await UserModel.findById(data.driver);
    if (!driver) {
      throw new NotFoundException('Driver not found');
    }
    if (driver.role !== UserRole.DRIVER) {
      throw new ValidationException('Selected user is not a driver');
    }
    if (!driver.isActive) {
      throw new ValidationException('Driver is not active');
    }

    // Check if driver has any active trips
    const driverActiveTrips = await TripModel.find({
      driver: data.driver,
      status: { $in: [TripStatus.PLANNED, TripStatus.IN_PROGRESS] },
    });
    if (driverActiveTrips.length > 0) {
      throw new ValidationException('Driver already has an active trip');
    }

    // Validation 3: Truck validity check
    const truck = await TruckModel.findById(data.truck);
    if (!truck) {
      throw new NotFoundException('Truck not found');
    }
    if (truck.status !== TruckStatus.AVAILABLE) {
      throw new ValidationException(`Truck is not available. Current status: ${truck.status}`);
    }
    if (!truck.currentKm || truck.currentKm < 0) {
      throw new ValidationException('Truck currentKm is invalid');
    }
    if (truck.currentKm !== data.startKm) {
      throw new ValidationException(`Truck currentKm (${truck.currentKm}) does not match trip startKm (${data.startKm})`);
    }

    // Check if truck has active trips
    const truckActiveTrips = await TripModel.find({
      truck: data.truck,
      status: { $in: [TripStatus.PLANNED, TripStatus.IN_PROGRESS] },
    });
    if (truckActiveTrips.length > 0) {
      throw new ValidationException('Truck already has an active trip');
    }

    // Check truck maintenance status
    const truckRemainingKm = await this.calculateRemainingKmBeforeMaintenance(data.truck, VehicleType.TRUCK);
    if (truckRemainingKm < MIN_REQUIRED_MAINTENANCE_DISTANCE) {
      throw new ValidationException(
        `Truck needs maintenance soon. Only ${truckRemainingKm}km remaining before required maintenance.`
      );
    }

    // Check truck tire status
    await this.validateVehicleTires(data.truck, VehicleType.TRUCK, data.distance);

    // Validation 4: Trailer validity check (if provided)
    if (data.trailer) {
      const trailer = await TrailerModel.findById(data.trailer);
      if (!trailer) {
        throw new NotFoundException('Trailer not found');
      }
      if (trailer.status !== TrailerStatus.AVAILABLE) {
        throw new ValidationException(`Trailer is not available. Current status: ${trailer.status}`);
      }
      if (!trailer.currentKm || trailer.currentKm < 0) {
        throw new ValidationException('Trailer currentKm is invalid');
      }

      // Check if trailer has active trips
      const trailerActiveTrips = await TripModel.find({
        trailer: data.trailer,
        status: { $in: [TripStatus.PLANNED, TripStatus.IN_PROGRESS] },
      });
      if (trailerActiveTrips.length > 0) {
        throw new ValidationException('Trailer already has an active trip');
      }

      // Check trailer maintenance status
      const trailerRemainingKm = await this.calculateRemainingKmBeforeMaintenance(data.trailer, VehicleType.TRAILER);
      if (trailerRemainingKm < MIN_REQUIRED_MAINTENANCE_DISTANCE) {
        throw new ValidationException(
          `Trailer needs maintenance soon. Only ${trailerRemainingKm}km remaining before required maintenance.`
        );
      }

      // Check trailer tire status
      await this.validateVehicleTires(data.trailer, VehicleType.TRAILER, data.distance);
    }

    // Validation 6: Distance feasibility check
    if (truckRemainingKm < data.distance) {
      throw new ValidationException(
        `Trip distance (${data.distance}km) exceeds truck's remaining km before maintenance (${truckRemainingKm}km)`
      );
    }

    if (data.trailer) {
      const trailerRemainingKm = await this.calculateRemainingKmBeforeMaintenance(data.trailer, VehicleType.TRAILER);
      if (trailerRemainingKm < data.distance) {
        throw new ValidationException(
          `Trip distance (${data.distance}km) exceeds trailer's remaining km before maintenance (${trailerRemainingKm}km)`
        );
      }
    }

    // All validations passed, create the trip
    const trip = await this.tripRepository.create(data as any);

    // Update truck and trailer status to IN_USE
    await TruckModel.findByIdAndUpdate(data.truck, { status: TruckStatus.IN_USE });
    if (data.trailer) {
      await TrailerModel.findByIdAndUpdate(data.trailer, { status: TrailerStatus.IN_USE });
    }

    return trip;
  }

  /**
   * Validation 5: Tire check for a vehicle (truck or trailer)
   */
  private async validateVehicleTires(vehicleId: string, vehicleType: VehicleType, tripDistance: number): Promise<void> {
    const tires = await TireModel.find({ vehicle: vehicleId, vehicleType });

    if (tires.length === 0) {
      throw new ValidationException(`No tires found for ${vehicleType.toLowerCase()}`);
    }

    for (const tire of tires) {
      // Check tire status
      if ([TireStatus.WORN, TireStatus.NEEDS_REPLACEMENT].includes(tire.status as TireStatus)) {
        throw new ValidationException(
          `${vehicleType} tire at position ${tire.position} has status "${tire.status}" and needs replacement`
        );
      }

      // Calculate remaining tire life
      const remainingTireLife = tire.installKm + tire.maxLifeKm - tire.currentKm;

      if (remainingTireLife < MIN_REQUIRED_TIRE_DISTANCE) {
        throw new ValidationException(
          `${vehicleType} tire at position ${tire.position} has only ${remainingTireLife}km remaining (minimum required: ${MIN_REQUIRED_TIRE_DISTANCE}km)`
        );
      }

      // Check if tire can handle the trip distance
      if (remainingTireLife < tripDistance) {
        throw new ValidationException(
          `${vehicleType} tire at position ${tire.position} cannot complete trip. Remaining life: ${remainingTireLife}km, Trip distance: ${tripDistance}km`
        );
      }
    }
  }

  /**
   * Calculate remaining km before next required maintenance for a vehicle
   */
  private async calculateRemainingKmBeforeMaintenance(vehicleId: string, vehicleType: VehicleType): Promise<number> {
    // Find the most recent maintenance record with nextDueKm
    const lastMaintenance = await MaintenanceModel.findOne({
      vehicle: vehicleId,
      vehicleType,
      nextDueKm: { $exists: true, $ne: null },
    })
      .sort({ performedAt: -1 })
      .limit(1);

    if (!lastMaintenance || !lastMaintenance.nextDueKm) {
      // No maintenance scheduled, return a large number
      return Number.MAX_SAFE_INTEGER;
    }

    // Get current vehicle km
    let currentKm = 0;
    if (vehicleType === VehicleType.TRUCK) {
      const truck = await TruckModel.findById(vehicleId);
      currentKm = truck?.currentKm || 0;
    } else if (vehicleType === VehicleType.TRAILER) {
      const trailer = await TrailerModel.findById(vehicleId);
      currentKm = trailer?.currentKm || 0;
    }

    const remainingKm = lastMaintenance.nextDueKm - currentKm;
    return Math.max(0, remainingKm);
  }

  async getTripById(id: string) {
    const trip = await this.tripRepository.findById(id);
    if (!trip) {
      throw new NotFoundException('Trip not found');
    }
    return trip;
  }

  async getAllTrips() {
    return this.tripRepository.findAll();
  }

  async getTripsByDriver(driverId: string) {
    return this.tripRepository.findByDriver(driverId);
  }

  async getTripsByStatus(status: string) {
    return this.tripRepository.findByStatus(status);
  }

  async updateTrip(id: string, data: UpdateTripDto) {
    const trip = await this.tripRepository.update(id, data);
    if (!trip) {
      throw new NotFoundException('Trip not found');
    }
    return trip;
  }

  async updateStatus(id: string, status: TripStatus, currentUserId: string) {
    const trip = await this.tripRepository.findById(id);
    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    const currentUser = await UserModel.findById(currentUserId);
    if (!currentUser) {
      throw new NotFoundException('Current user not found');
    }

    // Drivers can only update their own trips
    if (currentUser.role === UserRole.DRIVER && trip.driver.toString() !== currentUserId) {
      throw new ForbiddenException('You can only update your own trips');
    }

    const updateData: any = { status };

    // Status transition logic
    if (status === TripStatus.IN_PROGRESS) {
      if (trip.status !== TripStatus.PLANNED) {
        throw new ValidationException('Can only start a planned trip');
      }
      updateData.startedAt = new Date();
    } else if (status === TripStatus.COMPLETED) {
      if (trip.status !== TripStatus.IN_PROGRESS) {
        throw new ValidationException('Can only complete an in-progress trip');
      }
      updateData.completedAt = new Date();

      // Update vehicle statuses back to AVAILABLE
      await TruckModel.findByIdAndUpdate(trip.truck, { status: TruckStatus.AVAILABLE });
      if (trip.trailer) {
        await TrailerModel.findByIdAndUpdate(trip.trailer, { status: TrailerStatus.AVAILABLE });
      }

      // Calculate fuel consumption if endKm is provided
      if (trip.endKm) {
        const distanceTraveled = trip.endKm - trip.startKm;
        if (distanceTraveled > 0 && trip.fuelConsumed) {
          // Fuel consumption is already set, just validate
          if (trip.fuelConsumed < 0) {
            throw new ValidationException('Fuel consumed cannot be negative');
          }
        }

        // Update truck and trailer currentKm
        await TruckModel.findByIdAndUpdate(trip.truck, { 
          currentKm: trip.endKm 
        });

        if (trip.trailer) {
          // Update trailer km as well
          const trailer = await TrailerModel.findById(trip.trailer);
          if (trailer) {
            const newTrailerKm = trailer.currentKm + distanceTraveled;
            await TrailerModel.findByIdAndUpdate(trip.trailer, { 
              currentKm: newTrailerKm 
            });
          }
        }

        // Update tire currentKm for truck and trailer
        await this.updateVehicleTiresKm(trip.truck.toString(), distanceTraveled, VehicleType.TRUCK);
        if (trip.trailer) {
          await this.updateVehicleTiresKm(trip.trailer.toString(), distanceTraveled, VehicleType.TRAILER);
        }
      }
    } else if (status === TripStatus.CANCELLED) {
      // Release vehicle resources
      await TruckModel.findByIdAndUpdate(trip.truck, { status: TruckStatus.AVAILABLE });
      if (trip.trailer) {
        await TrailerModel.findByIdAndUpdate(trip.trailer, { status: TrailerStatus.AVAILABLE });
      }
    }

    return this.tripRepository.update(id, updateData);
  }

  /**
   * Update tire kilometers after trip completion
   */
  private async updateVehicleTiresKm(vehicleId: string, distanceTraveled: number, vehicleType: VehicleType): Promise<void> {
    const tires = await TireModel.find({ vehicle: vehicleId, vehicleType });
    
    for (const tire of tires) {
      const newCurrentKm = tire.currentKm + distanceTraveled;
      const remainingLife = tire.installKm + tire.maxLifeKm - newCurrentKm;
      
      let newStatus = tire.status;
      if (remainingLife <= 0) {
        newStatus = TireStatus.NEEDS_REPLACEMENT;
      } else if (remainingLife < MIN_REQUIRED_TIRE_DISTANCE) {
        newStatus = TireStatus.WORN;
      }
      
      await TireModel.findByIdAndUpdate(tire._id, {
        currentKm: newCurrentKm,
        status: newStatus,
      });
    }
  }

  async deleteTrip(id: string) {
    const trip = await this.tripRepository.delete(id);
    if (!trip) {
      throw new NotFoundException('Trip not found');
    }
    return trip;
  }

  /**
   * Calculate trip cost based on distance and fuel consumption
   */
  async calculateTripCost(tripId: string, fuelPricePerLiter: number): Promise<number> {
    const trip = await this.getTripById(tripId);
    
    if (trip.status !== TripStatus.COMPLETED) {
      throw new ValidationException('Can only calculate cost for completed trips');
    }
    
    if (!trip.fuelConsumed) {
      throw new ValidationException('Fuel consumption data not available');
    }
    
    return trip.fuelConsumed * fuelPricePerLiter;
  }

}
