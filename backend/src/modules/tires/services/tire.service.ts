import { ITireRepository } from '../repositories/tire.repository';
import { CreateTireDto } from '../dto/create-tire.dto';
import { UpdateTireDto } from '../dto/update-tire.dto';
import { NotFoundException } from '../../../shared/exceptions/not-found.exception';

export class TireService {
  constructor(private readonly tireRepository: ITireRepository) {}

  async createTire(data: CreateTireDto) {
    return this.tireRepository.create(data as any);
  }

  async getTireById(id: string) {
    const tire = await this.tireRepository.findById(id);
    if (!tire) {
      throw new NotFoundException('Tire not found');
    }
    return tire;
  }

  async getAllTires() {
    return this.tireRepository.findAll();
  }

  async getTiresByVehicle(vehicleId: string) {
    return this.tireRepository.findByVehicle(vehicleId);
  }

  async getTiresByStatus(status: string) {
    return this.tireRepository.findByStatus(status);
  }

  async updateTire(id: string, data: UpdateTireDto) {
    const tire = await this.tireRepository.update(id, data);
    if (!tire) {
      throw new NotFoundException('Tire not found');
    }
    return tire;
  }

  async deleteTire(id: string) {
    const tire = await this.tireRepository.delete(id);
    if (!tire) {
      throw new NotFoundException('Tire not found');
    }
    return tire;
  }
}
