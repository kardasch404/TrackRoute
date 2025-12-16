import mongoose, { Schema, Document, Types } from 'mongoose';
import { TireStatus, VehicleType } from '../../shared/constants/status.constant';

export interface ITire {
  vehicle: Types.ObjectId;
  vehicleType: VehicleType;
  position: string;
  brand: string;
  installKm: number;
  currentKm: number;
  maxLifeKm: number;
  status: TireStatus;
}

export interface ITireDocument extends ITire, Document {}

const tireSchema = new Schema<ITireDocument>(
  {
    vehicle: { type: Schema.Types.ObjectId, required: true, refPath: 'vehicleType' },
    vehicleType: { type: String, enum: Object.values(VehicleType), required: true },
    position: { type: String, required: true },
    brand: { type: String, required: true },
    installKm: { type: Number, required: true },
    currentKm: { type: Number, required: true },
    maxLifeKm: { type: Number, required: true },
    status: { type: String, enum: Object.values(TireStatus), default: TireStatus.GOOD },
  },
  { timestamps: true }
);

tireSchema.index({ vehicle: 1, vehicleType: 1 });
tireSchema.index({ status: 1 });

export const TireModel = mongoose.model<ITireDocument>('Tire', tireSchema);
