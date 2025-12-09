import { TrailerModel, ITrailerDocument } from '../../../database/models/trailer.model';
import { CreateTrailerDto } from '../dto/create-trailer.dto';
import { UpdateTrailerDto } from '../dto/update-trailer.dto';
import { IRepository } from '../../../shared/types/common.types';

export interface ITrailerRepository extends IRepository<ITrailerDocument> {
  findByRegistration(registration: string): Promise<ITrailerDocument | null>;
  findByStatus(status: string): Promise<ITrailerDocument[]>;
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

  async update(id: string, data: UpdateTrailerDto): Promise<ITrailerDocument | null> {
    return TrailerModel.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<ITrailerDocument | null> {
    return TrailerModel.findByIdAndDelete(id);
  }
}
