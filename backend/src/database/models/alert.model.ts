import mongoose, { Schema, Document, Types } from 'mongoose';
import { VehicleType } from '../../shared/constants/status.constant';

export enum AlertType {
  TIRE_WARNING = 'TIRE_WARNING',
  TIRE_CRITICAL = 'TIRE_CRITICAL',
  TIRE_EXPLOSION = 'TIRE_EXPLOSION',
  OIL_MAINTENANCE = 'OIL_MAINTENANCE',
  ENGINE_TEMP = 'ENGINE_TEMP',
  FUEL_LOW = 'FUEL_LOW',
  FUEL_CRITICAL = 'FUEL_CRITICAL',
  OVERLOAD = 'OVERLOAD',
  DRIVER_REST = 'DRIVER_REST',
  SPARE_TIRE_LIMIT = 'SPARE_TIRE_LIMIT',
}

export enum AlertSeverity {
  INFO = 'INFO',
  WARNING = 'WARNING',
  CRITICAL = 'CRITICAL',
  EMERGENCY = 'EMERGENCY',
}

export interface IAlert {
  type: AlertType;
  severity: AlertSeverity;
  message: string;
  vehicle?: Types.ObjectId;
  vehicleType?: VehicleType;
  trip?: Types.ObjectId;
  driver?: Types.ObjectId;
  acknowledged: boolean;
  acknowledgedBy?: Types.ObjectId;
  acknowledgedAt?: Date;
  resolvedAt?: Date;
}

export interface IAlertDocument extends IAlert, Document {}

const alertSchema = new Schema<IAlertDocument>(
  {
    type: { type: String, enum: Object.values(AlertType), required: true },
    severity: { type: String, enum: Object.values(AlertSeverity), required: true },
    message: { type: String, required: true },
    vehicle: { type: Schema.Types.ObjectId, refPath: 'vehicleType' },
    vehicleType: { type: String, enum: Object.values(VehicleType) },
    trip: { type: Schema.Types.ObjectId, ref: 'Trip' },
    driver: { type: Schema.Types.ObjectId, ref: 'User' },
    acknowledged: { type: Boolean, default: false },
    acknowledgedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    acknowledgedAt: { type: Date },
    resolvedAt: { type: Date },
  },
  { timestamps: true }
);

alertSchema.index({ type: 1, severity: 1 });
alertSchema.index({ acknowledged: 1 });
alertSchema.index({ createdAt: -1 });

export const AlertModel = mongoose.model<IAlertDocument>('Alert', alertSchema);
