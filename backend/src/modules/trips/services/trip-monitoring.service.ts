import { TruckModel } from '../../../database/models/truck.model';
import { TrailerModel } from '../../../database/models/trailer.model';
import { TireModel } from '../../../database/models/tire.model';
import { TripModel } from '../../../database/models/trip.model';
import { AlertModel, AlertType, AlertSeverity } from '../../../database/models/alert.model';
import { ValidationException } from '../../../shared/exceptions/validation.exception';
import { VehicleType, TireStatus } from '../../../shared/constants/status.constant';

const OIL_CHANGE_INTERVAL_KM = 10000;
const MAX_ENGINE_TEMP = 110;
const LOW_FUEL_THRESHOLD = 15;
const TIRE_WARNING_THRESHOLD = 0.85;
const MAX_DRIVING_HOURS = 4;
const MAX_SPARE_TIRE_DISTANCE = 30;

export class TripMonitoringService {
  async checkTireCondition(vehicleId: string, vehicleType: VehicleType): Promise<void> {
    const tires = await TireModel.find({ vehicle: vehicleId, vehicleType, isActive: true, isSpare: false });

    for (const tire of tires) {
      const remainingKm = tire.installKm + tire.maxLifeKm - tire.currentKm;
      const warningThreshold = tire.maxLifeKm * TIRE_WARNING_THRESHOLD;

      if (tire.currentKm >= tire.installKm + tire.maxLifeKm) {
        tire.status = TireStatus.NEEDS_REPLACEMENT;
        await tire.save();
        await AlertModel.create({
          type: AlertType.TIRE_CRITICAL,
          severity: AlertSeverity.CRITICAL,
          message: `Tire at position ${tire.position} must be changed immediately`,
          vehicle: vehicleId,
          vehicleType,
        });
        throw new ValidationException(`Tire at position ${tire.position} must be changed immediately`);
      }

      if (remainingKm <= (tire.maxLifeKm - warningThreshold)) {
        tire.status = TireStatus.WORN;
        await tire.save();
        await AlertModel.create({
          type: AlertType.TIRE_WARNING,
          severity: AlertSeverity.WARNING,
          message: `Tire ${tire.position} at 85% life - ${remainingKm}km remaining`,
          vehicle: vehicleId,
          vehicleType,
        });
      }

      if (tire.explosionDetected) {
        await this.activateSpareTire(vehicleId, vehicleType, tire.position);
      }
    }
  }

  async activateSpareTire(vehicleId: string, vehicleType: VehicleType, position: string): Promise<void> {
    await TireModel.findOneAndUpdate(
      { vehicle: vehicleId, vehicleType, position, isSpare: false },
      { isActive: false, status: TireStatus.NEEDS_REPLACEMENT }
    );

    const spareTire = await TireModel.findOne({ vehicle: vehicleId, vehicleType, isSpare: true, isActive: false });

    if (!spareTire) {
      await AlertModel.create({
        type: AlertType.TIRE_EXPLOSION,
        severity: AlertSeverity.EMERGENCY,
        message: 'No spare tire available. Workshop required immediately!',
        vehicle: vehicleId,
        vehicleType,
      });
      throw new ValidationException('No spare tire available. Workshop required immediately!');
    }

    spareTire.isActive = true;
    spareTire.position = position;
    spareTire.activatedAt = new Date();
    await spareTire.save();

    await AlertModel.create({
      type: AlertType.SPARE_TIRE_LIMIT,
      severity: AlertSeverity.WARNING,
      message: `Spare tire activated at position ${position}. Safe mode enabled. Maximum 30km allowed.`,
      vehicle: vehicleId,
      vehicleType,
    });

    throw new ValidationException(`Spare tire activated at position ${position}. Safe mode enabled. Maximum 30km allowed.`);
  }

  async checkSpareTireDistance(tripId: string): Promise<void> {
    const trip = await TripModel.findById(tripId);
    if (!trip) return;

    const spareTires = await TireModel.find({
      vehicle: trip.truck,
      vehicleType: VehicleType.TRUCK,
      isSpare: true,
      isActive: true,
    });

    if (spareTires.length > 0 && trip.distance > MAX_SPARE_TIRE_DISTANCE) {
      throw new ValidationException(`Spare tire active. Maximum ${MAX_SPARE_TIRE_DISTANCE}km allowed. Workshop required!`);
    }
  }

  async checkOilMaintenance(truckId: string): Promise<void> {
    const truck = await TruckModel.findById(truckId);
    if (!truck) return;

    if (truck.kmSinceLastOil >= OIL_CHANGE_INTERVAL_KM) {
      await AlertModel.create({
        type: AlertType.OIL_MAINTENANCE,
        severity: AlertSeverity.CRITICAL,
        message: `Oil change required! ${truck.kmSinceLastOil}km since last change.`,
        vehicle: truckId,
        vehicleType: VehicleType.TRUCK,
      });
      throw new ValidationException(`Oil change required! ${truck.kmSinceLastOil}km since last change.`);
    }
  }

  async checkEngineTemperature(truckId: string): Promise<void> {
    const truck = await TruckModel.findById(truckId);
    if (!truck) return;

    if (truck.engineTemp && truck.engineTemp > MAX_ENGINE_TEMP) {
      await AlertModel.create({
        type: AlertType.ENGINE_TEMP,
        severity: AlertSeverity.EMERGENCY,
        message: `CRITICAL: Engine temp ${truck.engineTemp}°C. Stop engine immediately!`,
        vehicle: truckId,
        vehicleType: VehicleType.TRUCK,
      });
      throw new ValidationException(`CRITICAL: Engine temp ${truck.engineTemp}°C. Stop engine immediately!`);
    }
  }

  async checkTrailerLoad(trailerId: string, loadWeight: number): Promise<void> {
    const trailer = await TrailerModel.findById(trailerId);
    if (!trailer) return;

    if (loadWeight > trailer.capacity) {
      await AlertModel.create({
        type: AlertType.OVERLOAD,
        severity: AlertSeverity.EMERGENCY,
        message: `STOP! Load ${loadWeight}kg exceeds capacity ${trailer.capacity}kg. Fine risk!`,
        vehicle: trailerId,
        vehicleType: VehicleType.TRAILER,
      });
      throw new ValidationException(`STOP! Load ${loadWeight}kg exceeds capacity ${trailer.capacity}kg. Fine risk!`);
    }
  }

  calculateFuelConsumption(distance: number, loadWeight: number, baseConsumption: number = 30): number {
    const baseLoad = 20000;
    const baseFuelPerKm = baseConsumption / 300;
    const loadFactor = loadWeight / baseLoad;
    const adjustedFuelPerKm = baseFuelPerKm * (0.7 + 0.3 * loadFactor);
    return adjustedFuelPerKm * distance;
  }

  async checkFuelLevel(truckId: string): Promise<void> {
    const truck = await TruckModel.findById(truckId);
    if (!truck) return;

    const fuelPercentage = (truck.currentFuelLevel / truck.fuelCapacity) * 100;

    if (fuelPercentage < 10) {
      await AlertModel.create({
        type: AlertType.FUEL_CRITICAL,
        severity: AlertSeverity.CRITICAL,
        message: `CRITICAL: Only ${fuelPercentage.toFixed(1)}% fuel. Trip blocked!`,
        vehicle: truckId,
        vehicleType: VehicleType.TRUCK,
      });
      throw new ValidationException(`CRITICAL: Only ${fuelPercentage.toFixed(1)}% fuel. Trip blocked!`);
    } else if (fuelPercentage < LOW_FUEL_THRESHOLD) {
      await AlertModel.create({
        type: AlertType.FUEL_LOW,
        severity: AlertSeverity.WARNING,
        message: `Low fuel: ${fuelPercentage.toFixed(1)}%. Refuel required.`,
        vehicle: truckId,
        vehicleType: VehicleType.TRUCK,
      });
      throw new ValidationException(`Low fuel: ${fuelPercentage.toFixed(1)}%. Refuel required.`);
    }
  }

  async checkDriverRest(tripId: string): Promise<void> {
    const trip = await TripModel.findById(tripId);
    if (!trip) return;

    if (trip.drivingHours && trip.drivingHours >= MAX_DRIVING_HOURS) {
      await AlertModel.create({
        type: AlertType.DRIVER_REST,
        severity: AlertSeverity.WARNING,
        message: `Driver has been driving for ${trip.drivingHours} hours. Rest required!`,
        trip: tripId,
        driver: trip.driver,
      });
      throw new ValidationException(`Driver has been driving for ${trip.drivingHours} hours. Rest required!`);
    }
  }

  async validateTripStart(tripId: string): Promise<{ warnings: string[]; canStart: boolean }> {
    const trip = await TripModel.findById(tripId).populate('truck trailer');
    if (!trip) throw new ValidationException('Trip not found');

    const warnings: string[] = [];
    let canStart = true;

    try {
      await this.checkOilMaintenance(trip.truck.toString());
    } catch (error: any) {
      warnings.push(error.message);
      canStart = false;
    }

    try {
      await this.checkEngineTemperature(trip.truck.toString());
    } catch (error: any) {
      warnings.push(error.message);
      canStart = false;
    }

    try {
      await this.checkFuelLevel(trip.truck.toString());
    } catch (error: any) {
      warnings.push(error.message);
      canStart = false;
    }

    try {
      await this.checkTireCondition(trip.truck.toString(), VehicleType.TRUCK);
      if (trip.trailer) {
        await this.checkTireCondition(trip.trailer.toString(), VehicleType.TRAILER);
      }
    } catch (error: any) {
      warnings.push(error.message);
      canStart = false;
    }

    try {
      if (trip.trailer && trip.loadWeight) {
        await this.checkTrailerLoad(trip.trailer.toString(), trip.loadWeight);
      }
    } catch (error: any) {
      warnings.push(error.message);
      canStart = false;
    }

    try {
      await this.checkSpareTireDistance(tripId);
    } catch (error: any) {
      warnings.push(error.message);
      canStart = false;
    }

    if (trip.loadWeight) {
      const estimatedFuel = this.calculateFuelConsumption(trip.distance, trip.loadWeight);
      trip.estimatedFuelConsumption = estimatedFuel;
      await trip.save();
    }

    return { warnings, canStart };
  }
}
