import { AlertModel, AlertType, AlertSeverity } from '../../../database/models/alert.model';
import { VehicleType } from '../../../shared/constants/status.constant';

export class AlertService {
  async createAlert(data: {
    type: AlertType;
    severity: AlertSeverity;
    message: string;
    vehicleId?: string;
    vehicleType?: VehicleType;
    tripId?: string;
    driverId?: string;
  }) {
    return AlertModel.create({
      type: data.type,
      severity: data.severity,
      message: data.message,
      vehicle: data.vehicleId,
      vehicleType: data.vehicleType,
      trip: data.tripId,
      driver: data.driverId,
      acknowledged: false,
    });
  }

  async getActiveAlerts(filters?: { severity?: AlertSeverity; type?: AlertType; vehicleId?: string }) {
    const query: any = { acknowledged: false };
    if (filters?.severity) query.severity = filters.severity;
    if (filters?.type) query.type = filters.type;
    if (filters?.vehicleId) query.vehicle = filters.vehicleId;
    return AlertModel.find(query).sort({ createdAt: -1 }).populate('vehicle trip driver');
  }

  async acknowledgeAlert(alertId: string, userId: string) {
    return AlertModel.findByIdAndUpdate(
      alertId,
      { acknowledged: true, acknowledgedBy: userId, acknowledgedAt: new Date() },
      { new: true }
    );
  }

  async resolveAlert(alertId: string) {
    return AlertModel.findByIdAndUpdate(alertId, { resolvedAt: new Date() }, { new: true });
  }

  async getAlertHistory(filters?: { startDate?: Date; endDate?: Date; vehicleId?: string }) {
    const query: any = {};
    if (filters?.vehicleId) query.vehicle = filters.vehicleId;
    if (filters?.startDate || filters?.endDate) {
      query.createdAt = {};
      if (filters.startDate) query.createdAt.$gte = filters.startDate;
      if (filters.endDate) query.createdAt.$lte = filters.endDate;
    }
    return AlertModel.find(query).sort({ createdAt: -1 }).populate('vehicle trip driver');
  }
}
