import { Request, Response, NextFunction } from 'express';
import { DashboardService } from './dashboard.service';

export class DashboardController {
  private dashboardService: DashboardService;

  constructor() {
    this.dashboardService = new DashboardService();
  }

  getStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const stats = await this.dashboardService.getStats();
      res.json({ success: true, data: stats });
    } catch (error) {
      next(error);
    }
  };

  getRecentTrips = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const limit = parseInt(req.query.limit as string) || 5;
      const trips = await this.dashboardService.getRecentTrips(limit);
      res.json({ success: true, data: trips });
    } catch (error) {
      next(error);
    }
  };

  getFleetOverview = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const overview = await this.dashboardService.getFleetOverview();
      res.json({ success: true, data: overview });
    } catch (error) {
      next(error);
    }
  };

  getMaintenanceAlerts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const alerts = await this.dashboardService.getMaintenanceAlerts(limit);
      res.json({ success: true, data: alerts });
    } catch (error) {
      next(error);
    }
  };

  getTripStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const months = parseInt(req.query.months as string) || 6;
      const stats = await this.dashboardService.getTripStatsByMonth(months);
      res.json({ success: true, data: stats });
    } catch (error) {
      next(error);
    }
  };

  getDriverStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const limit = parseInt(req.query.limit as string) || 5;
      const stats = await this.dashboardService.getDriverStats(limit);
      res.json({ success: true, data: stats });
    } catch (error) {
      next(error);
    }
  };
}
