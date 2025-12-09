import { TireModel, ITireDocument } from '../../../database/models/tire.model';
import { CreateTireDto } from '../dto/create-tire.dto';
import { UpdateTireDto } from '../dto/update-tire.dto';
import { IRepository } from '../../../shared/types/common.types';

export interface ITireRepository extends IRepository<ITireDocument> {
  findByVehicle(vehicleId: string): Promise<ITireDocument[]>;
  findByStatus(status: string): Promise<ITireDocument[]>;
  findNeedingReplacement(): Promise<ITireDocument[]>;
  findWithPagination(page: number, limit: number, filters?: any): Promise<{ data: ITireDocument[]; total: number }>;
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

  async findNeedingReplacement(): Promise<ITireDocument[]> {
    return TireModel.find({
      $expr: { $gte: ['$currentKm', { $multiply: ['$maxLifeKm', 0.9] }] },
    }).populate('vehicle');
  }

  async findWithPagination(page: number, limit: number, filters: any = {}): Promise<{ data: ITireDocument[]; total: number }> {
    const skip = (page - 1) * limit;
    const query: any = {};
    if (filters.status) query.status = filters.status;
    if (filters.vehicleId) query.vehicle = filters.vehicleId;
    const [data, total] = await Promise.all([
      TireModel.find(query).populate('vehicle').sort({ createdAt: -1 }).skip(skip).limit(limit),
      TireModel.countDocuments(query),
    ]);
    return { data, total };
  }

  async update(id: string, data: UpdateTireDto): Promise<ITireDocument | null> {
    return TireModel.findByIdAndUpdate(id, data, { new: true }).populate('vehicle');
  }

  async delete(id: string): Promise<ITireDocument | null> {
    return TireModel.findByIdAndDelete(id);
  }
}
