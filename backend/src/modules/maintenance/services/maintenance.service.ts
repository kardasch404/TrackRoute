import { MaintenanceModel } from '../../../database/models/maintenance.model';
import { MaintenanceRuleModel } from '../../../database/models/maintenance-rule.model';
import { TruckModel } from '../../../database/models/truck.model';
import { TrailerModel } from '../../../database/models/trailer.model';
import { AlertModel } from '../../../database/models/alert.model';
import { AlertType, AlertSeverity } from '../../../database/models/alert.model';
import { ValidationException } from '../../../shared/exceptions/validation.exception';
import { NotFoundException } from '../../../shared/exceptions/not-found.exception';
import { MaintenanceType, VehicleType, TruckStatus } from '../../../shared/constants/status.constant';

const OIL_CHANGE_INTERVAL = 10000;
const MAX_ENGINE_TEMP = 110;

export class MaintenanceService {
  async recordMaintenance(data: {
    vehicleId: string;
    vehicleType: VehicleType;
    type: MaintenanceType;
    description: string;
    currentKm: number;
    cost: number;
  }) {
    const maintenance = await MaintenanceModel.create({
      vehicle: data.vehicleId,
      vehicleType: data.vehicleType,
      type: data.type,
      description: data.description,
      currentKm: data.currentKm,
      nextDueKm: data.type === MaintenanceType.OIL_CHANGE ? data.currentKm + OIL_CHANGE_INTERVAL : undefined,
      cost: data.cost,
      performedAt: new Date(),
    });

    if (data.type === MaintenanceType.OIL_CHANGE && data.vehicleType === VehicleType.TRUCK) {
      await TruckModel.findByIdAndUpdate(data.vehicleId, {
        kmSinceLastOil: 0,
        lastOilChangeKm: data.currentKm,
      });
    }

    return maintenance;
  }

  async checkOilMaintenance(truckId: string): Promise<void> {
    const truck = await TruckModel.findById(truckId);
    if (!truck) throw new NotFoundException('Truck not found');

    if (truck.kmSinceLastOil >= OIL_CHANGE_INTERVAL) {
      await AlertModel.create({
        type: AlertType.OIL_MAINTENANCE,
        severity: AlertSeverity.CRITICAL,
        message: `Oil change required! ${truck.kmSinceLastOil}km since last change.`,
        vehicle: truckId,
        vehicleType: VehicleType.TRUCK,
      });
      throw new ValidationException(`Oil change required! ${truck.kmSinceLastOil}km since last change.`);
    }
  }

  async checkEngineTemperature(truckId: string, currentTemp: number): Promise<void> {
    if (currentTemp > MAX_ENGINE_TEMP) {
      await TruckModel.findByIdAndUpdate(truckId, { status: TruckStatus.MAINTENANCE });
      await AlertModel.create({
        type: AlertType.ENGINE_TEMP,
        severity: AlertSeverity.EMERGENCY,
        message: `CRITICAL: Engine temp ${currentTemp}°C exceeds ${MAX_ENGINE_TEMP}°C. Stop engine immediately!`,
        vehicle: truckId,
        vehicleType: VehicleType.TRUCK,
      });
      throw new ValidationException(`CRITICAL: Engine temp ${currentTemp}°C. Stop engine immediately!`);
    }
    await TruckModel.findByIdAndUpdate(truckId, { engineTemp: currentTemp });
  }

  async getMaintenanceHistory(vehicleId: string, vehicleType: VehicleType) {
    return MaintenanceModel.find({ vehicle: vehicleId, vehicleType }).sort({ performedAt: -1 });
  }

  async createMaintenanceRule(data: {
    maintenanceType: MaintenanceType;
    intervalKm: number;
    alertThresholdKm: number;
    vehicleType: VehicleType;
  }) {
    return MaintenanceRuleModel.create(data);
  }

  async getMaintenanceRules(vehicleType?: VehicleType) {
    const query = vehicleType ? { vehicleType, isActive: true } : { isActive: true };
    return MaintenanceRuleModel.find(query);
  }
}
