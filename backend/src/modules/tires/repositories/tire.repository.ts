import { TireModel, ITireDocument } from '../../../database/models/tire.model';
import { CreateTireDto } from '../dto/create-tire.dto';
import { UpdateTireDto } from '../dto/update-tire.dto';
import { IRepository } from '../../../shared/types/common.types';

export interface ITireRepository extends IRepository<ITireDocument> {
  findByVehicle(vehicleId: string): Promise<ITireDocument[]>;
  findByStatus(status: string): Promise<ITireDocument[]>;
}

export class TireRepository implements ITireRepository {
  async create(data: CreateTireDto): Promise<ITireDocument> {
    return TireModel.create(data);
  }

  async findById(id: string): Promise<ITireDocument | null> {
    return TireModel.findById(id).populate('vehicle');
  }

  async findByVehicle(vehicleId: string): Promise<ITireDocument[]> {
    return TireModel.find({ vehicle: vehicleId }).sort({ position: 1 });
  }

  async findByStatus(status: string): Promise<ITireDocument[]> {
    return TireModel.find({ status }).populate('vehicle');
  }

  async findAll(): Promise<ITireDocument[]> {
    return TireModel.find().populate('vehicle').sort({ createdAt: -1 });
  }

  async update(id: string, data: UpdateTireDto): Promise<ITireDocument | null> {
    return TireModel.findByIdAndUpdate(id, data, { new: true }).populate('vehicle');
  }

  async delete(id: string): Promise<ITireDocument | null> {
    return TireModel.findByIdAndDelete(id);
  }
}
