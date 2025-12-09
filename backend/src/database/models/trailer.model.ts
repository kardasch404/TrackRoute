import mongoose, { Schema, Document } from 'mongoose';
import { TrailerStatus } from '../../shared/constants/status.constant';

export interface ITrailer {
  registration: string;
  type: string;
  capacity: number;
  currentKm: number;
  status: TrailerStatus;
}

export interface ITrailerDocument extends ITrailer, Document {}

const trailerSchema = new Schema<ITrailerDocument>(
  {
    registration: { type: String, required: true, unique: true, uppercase: true },
    type: { type: String, required: true },
    capacity: { type: Number, required: true },
    currentKm: { type: Number, required: true, default: 0 },
    status: { type: String, enum: Object.values(TrailerStatus), default: TrailerStatus.AVAILABLE },
  },
  { timestamps: true }
);

trailerSchema.index({ registration: 1 });
trailerSchema.index({ status: 1 });

export const TrailerModel = mongoose.model<ITrailerDocument>('Trailer', trailerSchema);
