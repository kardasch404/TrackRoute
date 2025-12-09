import { ITruckRepository } from '../repositories/truck.repository';
import { CreateTruckDto } from '../dto/create-truck.dto';
import { UpdateTruckDto } from '../dto/update-truck.dto';
import { ValidationException } from '../../../shared/exceptions/validation.exception';
import { NotFoundException } from '../../../shared/exceptions/not-found.exception';

export class TruckService {
  constructor(private readonly truckRepository: ITruckRepository) {}

  async createTruck(data: CreateTruckDto) {
    const existing = await this.truckRepository.findByRegistration(data.registration);
    if (existing) {
      throw new ValidationException('Truck with this registration already exists');
    }
    return this.truckRepository.create(data);
  }

  async getTruckById(id: string) {
    const truck = await this.truckRepository.findById(id);
    if (!truck) {
      throw new NotFoundException('Truck not found');
    }
    return truck;
  }

  async getAllTrucks() {
    return this.truckRepository.findAll();
  }

  async getTrucksByStatus(status: string) {
    return this.truckRepository.findByStatus(status);
  }

  async updateTruck(id: string, data: UpdateTruckDto) {
    if (data.registration) {
      const existing = await this.truckRepository.findByRegistration(data.registration);
      if (existing && existing._id.toString() !== id) {
        throw new ValidationException('Truck with this registration already exists');
      }
    }

    const truck = await this.truckRepository.update(id, data);
    if (!truck) {
      throw new NotFoundException('Truck not found');
    }
    return truck;
  }

  async deleteTruck(id: string) {
    const truck = await this.truckRepository.delete(id);
    if (!truck) {
      throw new NotFoundException('Truck not found');
    }
    return truck;
  }
}
