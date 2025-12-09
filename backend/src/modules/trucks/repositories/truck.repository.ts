import { TruckModel, ITruckDocument } from '../../../database/models/truck.model';
import { CreateTruckDto } from '../dto/create-truck.dto';
import { UpdateTruckDto } from '../dto/update-truck.dto';
import { IRepository } from '../../../shared/types/common.types';

export interface ITruckRepository extends IRepository<ITruckDocument> {
  findByRegistration(registration: string): Promise<ITruckDocument | null>;
  findByStatus(status: string): Promise<ITruckDocument[]>;
  findWithPagination(page: number, limit: number, filters?: any): Promise<{ data: ITruckDocument[]; total: number }>;
  searchByRegistration(query: string): Promise<ITruckDocument[]>;
}

export class TruckRepository implements ITruckRepository {
  async create(data: CreateTruckDto): Promise<ITruckDocument> {
    return TruckModel.create(data);
  }

  async findById(id: string): Promise<ITruckDocument | null> {
    return TruckModel.findById(id);
  }

  async findByRegistration(registration: string): Promise<ITruckDocument | null> {
    return TruckModel.findOne({ registration: registration.toUpperCase() });
  }

  async findByStatus(status: string): Promise<ITruckDocument[]> {
    return TruckModel.find({ status });
  }

  async findAll(): Promise<ITruckDocument[]> {
    return TruckModel.find().sort({ createdAt: -1 });
  }

  async findWithPagination(page: number, limit: number, filters: any = {}): Promise<{ data: ITruckDocument[]; total: number }> {
    const skip = (page - 1) * limit;
    const query = filters.status ? { status: filters.status } : {};
    const [data, total] = await Promise.all([
      TruckModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      TruckModel.countDocuments(query),
    ]);
    return { data, total };
  }

  async searchByRegistration(query: string): Promise<ITruckDocument[]> {
    return TruckModel.find({ registration: { $regex: query, $options: 'i' } }).limit(10);
  }

  async update(id: string, data: UpdateTruckDto): Promise<ITruckDocument | null> {
    return TruckModel.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<ITruckDocument | null> {
    return TruckModel.findByIdAndDelete(id);
  }
}
