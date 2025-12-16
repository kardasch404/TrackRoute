import mongoose, { Schema, Document, Types } from 'mongoose';
import { MaintenanceType, VehicleType } from '../../shared/constants/status.constant';

export interface IMaintenance {
  vehicle: Types.ObjectId;
  vehicleType: VehicleType;
  type: MaintenanceType;
  description: string;
  currentKm: number;
  nextDueKm?: number;
  cost: number;
  performedAt: Date;
}

export interface IMaintenanceDocument extends IMaintenance, Document {}

const maintenanceSchema = new Schema<IMaintenanceDocument>(
  {
    vehicle: { type: Schema.Types.ObjectId, required: true, refPath: 'vehicleType' },
    vehicleType: { type: String, enum: Object.values(VehicleType), required: true },
    type: { type: String, enum: Object.values(MaintenanceType), required: true },
    description: { type: String, required: true },
    currentKm: { type: Number, required: true },
    nextDueKm: { type: Number },
    cost: { type: Number, required: true },
    performedAt: { type: Date, required: true, default: Date.now },
  },
  { timestamps: true }
);

maintenanceSchema.index({ vehicle: 1, vehicleType: 1 });
maintenanceSchema.index({ type: 1 });
maintenanceSchema.index({ performedAt: -1 });

export const MaintenanceModel = mongoose.model<IMaintenanceDocument>('Maintenance', maintenanceSchema);
