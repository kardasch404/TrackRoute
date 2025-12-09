import mongoose, { Schema, Document, Types } from 'mongoose';
import { TripStatus } from '../../shared/constants/status.constant';

export interface ITrip {
  code: string;
  driver: Types.ObjectId;
  truck: Types.ObjectId;
  trailer?: Types.ObjectId;
  origin: string;
  destination: string;
  distance: number;
  startKm: number;
  endKm?: number;
  fuelConsumed?: number;
  status: TripStatus;
  startedAt?: Date;
  completedAt?: Date;
}

export interface ITripDocument extends ITrip, Document {}

const tripSchema = new Schema<ITripDocument>(
  {
    code: { type: String, required: true, unique: true, uppercase: true },
    driver: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    truck: { type: Schema.Types.ObjectId, ref: 'Truck', required: true },
    trailer: { type: Schema.Types.ObjectId, ref: 'Trailer' },
    origin: { type: String, required: true },
    destination: { type: String, required: true },
    distance: { type: Number, required: true },
    startKm: { type: Number, required: true },
    endKm: { type: Number },
    fuelConsumed: { type: Number },
    status: { type: String, enum: Object.values(TripStatus), default: TripStatus.PLANNED },
    startedAt: { type: Date },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

tripSchema.index({ code: 1 });
tripSchema.index({ driver: 1 });
tripSchema.index({ truck: 1 });
tripSchema.index({ status: 1 });
tripSchema.index({ startedAt: -1 });

export const TripModel = mongoose.model<ITripDocument>('Trip', tripSchema);
