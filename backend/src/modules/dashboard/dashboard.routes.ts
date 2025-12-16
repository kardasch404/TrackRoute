import { Router } from 'express';
import { DashboardController } from './dashboard.controller';
import { authMiddleware } from '../../shared/middleware/auth.middleware';
import { rbacMiddleware } from '../../shared/middleware/rbac.middleware';
import { Permission } from '../../shared/constants/permissions.constant';

const router = Router();
const dashboardController = new DashboardController();

// All routes require authentication
router.use(authMiddleware);

// Dashboard stats - Admin only
router.get(
  '/stats',
  rbacMiddleware([Permission.DASHBOARD_READ]),
  dashboardController.getStats
);

// Recent trips
router.get(
  '/recent-trips',
  rbacMiddleware([Permission.DASHBOARD_READ]),
  dashboardController.getRecentTrips
);

// Fleet overview
router.get(
  '/fleet-overview',
  rbacMiddleware([Permission.DASHBOARD_READ]),
  dashboardController.getFleetOverview
);

// Maintenance alerts
router.get(
  '/maintenance-alerts',
  rbacMiddleware([Permission.DASHBOARD_READ]),
  dashboardController.getMaintenanceAlerts
);

// Trip statistics for charts
router.get(
  '/trip-stats',
  rbacMiddleware([Permission.DASHBOARD_READ]),
  dashboardController.getTripStats
);

// Driver performance stats
router.get(
  '/driver-stats',
  rbacMiddleware([Permission.DASHBOARD_READ]),
  dashboardController.getDriverStats
);

export default router;
