import { TripModel, ITripDocument } from '../../../database/models/trip.model';
import { CreateTripDto } from '../dto/create-trip.dto';
import { UpdateTripDto } from '../dto/update-trip.dto';
import { IRepository } from '../../../shared/types/common.types';

export interface ITripRepository extends IRepository<ITripDocument> {
  findByCode(code: string): Promise<ITripDocument | null>;
  findByDriver(driverId: string): Promise<ITripDocument[]>;
  findByStatus(status: string): Promise<ITripDocument[]>;
  findByTruck(truckId: string): Promise<ITripDocument[]>;
}

export class TripRepository implements ITripRepository {
  async create(data: CreateTripDto): Promise<ITripDocument> {
    return TripModel.create(data);
  }

  async findById(id: string): Promise<ITripDocument | null> {
    return TripModel.findById(id).populate('driver truck trailer');
  }

  async findByCode(code: string): Promise<ITripDocument | null> {
    return TripModel.findOne({ code: code.toUpperCase() }).populate('driver truck trailer');
  }

  async findByDriver(driverId: string): Promise<ITripDocument[]> {
    return TripModel.find({ driver: driverId }).populate('truck trailer').sort({ createdAt: -1 });
  }

  async findByStatus(status: string): Promise<ITripDocument[]> {
    return TripModel.find({ status }).populate('driver truck trailer').sort({ createdAt: -1 });
  }

  async findByTruck(truckId: string): Promise<ITripDocument[]> {
    return TripModel.find({ truck: truckId }).populate('driver trailer').sort({ createdAt: -1 });
  }

  async findAll(): Promise<ITripDocument[]> {
    return TripModel.find().populate('driver truck trailer').sort({ createdAt: -1 });
  }

  async update(id: string, data: UpdateTripDto): Promise<ITripDocument | null> {
    return TripModel.findByIdAndUpdate(id, data, { new: true }).populate('driver truck trailer');
  }

  async delete(id: string): Promise<ITripDocument | null> {
    return TripModel.findByIdAndDelete(id);
  }
}
