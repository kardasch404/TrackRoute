import { ITripRepository } from '../repositories/trip.repository';
import { CreateTripDto } from '../dto/create-trip.dto';
import { UpdateTripDto } from '../dto/update-trip.dto';
import { ValidationException } from '../../../shared/exceptions/validation.exception';
import { NotFoundException } from '../../../shared/exceptions/not-found.exception';
import { TripStatus } from '../../../shared/constants/status.constant';

export class TripService {
  constructor(private readonly tripRepository: ITripRepository) {}

  async createTrip(data: CreateTripDto) {
    const existing = await this.tripRepository.findByCode(data.code);
    if (existing) {
      throw new ValidationException('Trip with this code already exists');
    }
    return this.tripRepository.create(data);
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

  async updateStatus(id: string, status: TripStatus) {
    const trip = await this.tripRepository.findById(id);
    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    const updateData: any = { status };
    if (status === TripStatus.IN_PROGRESS) {
      updateData.startedAt = new Date();
    } else if (status === TripStatus.COMPLETED) {
      updateData.completedAt = new Date();
    }

    return this.tripRepository.update(id, updateData);
  }

  async deleteTrip(id: string) {
    const trip = await this.tripRepository.delete(id);
    if (!trip) {
      throw new NotFoundException('Trip not found');
    }
    return trip;
  }
}
