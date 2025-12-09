import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IFuelRecord {
  trip: Types.ObjectId;
  truck: Types.ObjectId;
  volume: number;
  cost: number;
  stationName: string;
  date: Date;
}

export interface IFuelRecordDocument extends IFuelRecord, Document {}

const fuelRecordSchema = new Schema<IFuelRecordDocument>(
  {
    trip: { type: Schema.Types.ObjectId, ref: 'Trip', required: true },
    truck: { type: Schema.Types.ObjectId, ref: 'Truck', required: true },
    volume: { type: Number, required: true },
    cost: { type: Number, required: true },
    stationName: { type: String, required: true },
    date: { type: Date, required: true, default: Date.now },
  },
  { timestamps: true }
);

fuelRecordSchema.index({ trip: 1 });
fuelRecordSchema.index({ truck: 1 });
fuelRecordSchema.index({ date: -1 });

export const FuelRecordModel = mongoose.model<IFuelRecordDocument>('FuelRecord', fuelRecordSchema);
