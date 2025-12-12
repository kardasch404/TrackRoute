import mongoose, { Schema, Document } from 'mongoose';
import { MaintenanceType, VehicleType } from '../../shared/constants/status.constant';

export interface IMaintenanceRule {
  maintenanceType: MaintenanceType;
  intervalKm: number;
  alertThresholdKm: number;
  vehicleType: VehicleType;
  isActive: boolean;
}

export interface IMaintenanceRuleDocument extends IMaintenanceRule, Document {}

const maintenanceRuleSchema = new Schema<IMaintenanceRuleDocument>(
  {
    maintenanceType: { type: String, enum: Object.values(MaintenanceType), required: true },
    intervalKm: { type: Number, required: true },
    alertThresholdKm: { type: Number, required: true },
    vehicleType: { type: String, enum: Object.values(VehicleType), required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

maintenanceRuleSchema.index({ maintenanceType: 1, vehicleType: 1 });

export const MaintenanceRuleModel = mongoose.model<IMaintenanceRuleDocument>('MaintenanceRule', maintenanceRuleSchema);
