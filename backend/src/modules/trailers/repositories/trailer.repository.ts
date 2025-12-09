import { TrailerModel, ITrailerDocument } from '../../../database/models/trailer.model';
import { CreateTrailerDto } from '../dto/create-trailer.dto';
import { UpdateTrailerDto } from '../dto/update-trailer.dto';
import { IRepository } from '../../../shared/types/common.types';

export interface ITrailerRepository extends IRepository<ITrailerDocument> {
  findByRegistration(registration: string): Promise<ITrailerDocument | null>;
  findByStatus(status: string): Promise<ITrailerDocument[]>;
  findAvailable(): Promise<ITrailerDocument[]>;
  findWithPagination(page: number, limit: number, filters?: any): Promise<{ data: ITrailerDocument[]; total: number }>;
}

export class TrailerRepository implements ITrailerRepository {
  async create(data: CreateTrailerDto): Promise<ITrailerDocument> {
    return TrailerModel.create(data);
  }

  async findById(id: string): Promise<ITrailerDocument | null> {
    return TrailerModel.findById(id);
  }

  async findByRegistration(registration: string): Promise<ITrailerDocument | null> {
    return TrailerModel.findOne({ registration: registration.toUpperCase() });
  }

  async findByStatus(status: string): Promise<ITrailerDocument[]> {
    return TrailerModel.find({ status });
  }

  async findAll(): Promise<ITrailerDocument[]> {
    return TrailerModel.find().sort({ createdAt: -1 });
  }

  async findAvailable(): Promise<ITrailerDocument[]> {
    return TrailerModel.find({ status: 'AVAILABLE' });
  }

  async findWithPagination(page: number, limit: number, filters: any = {}): Promise<{ data: ITrailerDocument[]; total: number }> {
    const skip = (page - 1) * limit;
    const query = filters.status ? { status: filters.status } : {};
    const [data, total] = await Promise.all([
      TrailerModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      TrailerModel.countDocuments(query),
    ]);
    return { data, total };
  }

  async update(id: string, data: UpdateTrailerDto): Promise<ITrailerDocument | null> {
    return TrailerModel.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<ITrailerDocument | null> {
    return TrailerModel.findByIdAndDelete(id);
  }
}
