import mongoose, { Schema, HydratedDocument } from 'mongoose';
import { TruckStatus } from '../../shared/constants/status.constant';

export interface ITruck {
  registration: string;
  brand: string;
  truckModel: string;
  year: number;
  fuelCapacity: number;
  currentKm: number;
  status: TruckStatus;
}

export type ITruckDocument = HydratedDocument<ITruck>;

const truckSchema = new Schema<ITruckDocument>(
  {
    registration: { type: String, required: true, unique: true, uppercase: true },
    brand: { type: String, required: true },
    truckModel: { type: String, required: true },
    year: { type: Number, required: true },
    fuelCapacity: { type: Number, required: true },
    currentKm: { type: Number, required: true, default: 0 },
    status: { type: String, enum: Object.values(TruckStatus), default: TruckStatus.AVAILABLE },
  },
  { timestamps: true }
);

truckSchema.index({ registration: 1 });
truckSchema.index({ status: 1 });

export const TruckModel = mongoose.model<ITruckDocument>('Truck', truckSchema);
