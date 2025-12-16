import { TruckModel } from '../../database/models/truck.model';
import { TrailerModel } from '../../database/models/trailer.model';
import { TripModel } from '../../database/models/trip.model';
import { UserModel } from '../../database/models/user.model';
import { TireModel } from '../../database/models/tire.model';
import { MaintenanceModel } from '../../database/models/maintenance.model';
import { TruckStatus, TrailerStatus, TripStatus, TireStatus } from '../../shared/constants/status.constant';
import { UserRole } from '../../shared/constants/roles.constant';

export class DashboardService {
  /**
   * Get main dashboard statistics
   */
  async getStats() {
    const [
      totalTrucks,
      availableTrucks,
      inUseTrucks,
      maintenanceTrucks,
      totalTrailers,
      availableTrailers,
      inUseTrailers,
      maintenanceTrailers,
      totalDrivers,
      activeDrivers,
      plannedTrips,
      inProgressTrips,
      completedTrips,
      tiresNeedingReplacement,
    ] = await Promise.all([
      TruckModel.countDocuments(),
      TruckModel.countDocuments({ status: TruckStatus.AVAILABLE }),
      TruckModel.countDocuments({ status: TruckStatus.IN_USE }),
      TruckModel.countDocuments({ status: TruckStatus.MAINTENANCE }),
      TrailerModel.countDocuments(),
      TrailerModel.countDocuments({ status: TrailerStatus.AVAILABLE }),
      TrailerModel.countDocuments({ status: TrailerStatus.IN_USE }),
      TrailerModel.countDocuments({ status: TrailerStatus.MAINTENANCE }),
      UserModel.countDocuments({ role: UserRole.DRIVER }),
      UserModel.countDocuments({ role: UserRole.DRIVER, isActive: true }),
      TripModel.countDocuments({ status: TripStatus.PLANNED }),
      TripModel.countDocuments({ status: TripStatus.IN_PROGRESS }),
      TripModel.countDocuments({ status: TripStatus.COMPLETED }),
      TireModel.countDocuments({ status: { $in: [TireStatus.WORN, TireStatus.NEEDS_REPLACEMENT] } }),
    ]);

    // Calculate total distance from completed trips
    const completedTripsData = await TripModel.find({ status: TripStatus.COMPLETED }).select('distance fuelConsumed');
    const totalDistance = completedTripsData.reduce((sum, trip) => sum + (trip.distance || 0), 0);
    const totalFuelConsumed = completedTripsData.reduce((sum, trip) => sum + (trip.fuelConsumed || 0), 0);

    // Calculate maintenance alerts count
    const maintenanceAlerts = tiresNeedingReplacement + maintenanceTrucks + maintenanceTrailers;

    return {
      fleet: {
        trucks: {
          total: totalTrucks,
          available: availableTrucks,
          inUse: inUseTrucks,
          maintenance: maintenanceTrucks,
        },
        trailers: {
          total: totalTrailers,
          available: availableTrailers,
          inUse: inUseTrailers,
          maintenance: maintenanceTrailers,
        },
      },
      drivers: {
        total: totalDrivers,
        active: activeDrivers,
      },
      trips: {
        planned: plannedTrips,
        inProgress: inProgressTrips,
        completed: completedTrips,
        active: plannedTrips + inProgressTrips,
      },
      performance: {
        totalDistance,
        totalFuelConsumed,
        avgFuelEfficiency: totalDistance > 0 ? (totalFuelConsumed / totalDistance * 100).toFixed(2) : 0,
      },
      alerts: {
        total: maintenanceAlerts,
        tiresNeedingReplacement,
        vehiclesInMaintenance: maintenanceTrucks + maintenanceTrailers,
      },
    };
  }

  /**
   * Get recent trips for dashboard
   */
  async getRecentTrips(limit = 5) {
    const trips = await TripModel.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('driver', 'firstName lastName')
      .populate('truck', 'registration')
      .lean();

    return trips.map(trip => ({
      _id: trip._id,
      code: trip.code,
      driver: trip.driver ? `${(trip.driver as any).firstName} ${(trip.driver as any).lastName}` : 'Unassigned',
      truck: (trip.truck as any)?.registration || 'N/A',
      origin: trip.origin,
      destination: trip.destination,
      status: trip.status,
      distance: trip.distance,
      createdAt: trip.createdAt,
    }));
  }

  /**
   * Get fleet overview (trucks and trailers by status)
   */
  async getFleetOverview() {
    const [trucksByStatus, trailersByStatus] = await Promise.all([
      TruckModel.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      TrailerModel.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
    ]);

    return {
      trucks: trucksByStatus.map(item => ({ status: item._id, count: item.count })),
      trailers: trailersByStatus.map(item => ({ status: item._id, count: item.count })),
    };
  }

  /**
   * Get maintenance alerts
   */
  async getMaintenanceAlerts(limit = 10) {
    // Get tires needing replacement
    const tiresAlerts = await TireModel.find({
      status: { $in: [TireStatus.WORN, TireStatus.NEEDS_REPLACEMENT] },
    })
      .populate('vehicle', 'registration')
      .limit(limit)
      .lean();

    // Get trucks in maintenance
    const trucksInMaintenance = await TruckModel.find({ status: TruckStatus.MAINTENANCE })
      .select('registration brand model')
      .limit(limit)
      .lean();

    // Get trailers in maintenance
    const trailersInMaintenance = await TrailerModel.find({ status: TrailerStatus.MAINTENANCE })
      .select('registration type')
      .limit(limit)
      .lean();

    const alerts = [
      ...tiresAlerts.map(tire => ({
        id: tire._id,
        type: 'tire',
        severity: tire.status === TireStatus.NEEDS_REPLACEMENT ? 'danger' : 'warning',
        message: `${tire.vehicleType} tire at position ${tire.position} ${tire.status === TireStatus.NEEDS_REPLACEMENT ? 'needs replacement' : 'is worn'}`,
        vehicle: (tire.vehicle as any)?.registration || 'Unknown',
      })),
      ...trucksInMaintenance.map(truck => ({
        id: truck._id,
        type: 'truck',
        severity: 'warning',
        message: `Truck ${truck.registration} is in maintenance`,
        vehicle: truck.registration,
      })),
      ...trailersInMaintenance.map(trailer => ({
        id: trailer._id,
        type: 'trailer',
        severity: 'warning',
        message: `Trailer ${trailer.registration} is in maintenance`,
        vehicle: trailer.registration,
      })),
    ];

    return alerts.slice(0, limit);
  }

  /**
   * Get trip statistics by month for charts
   */
  async getTripStatsByMonth(months = 6) {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    const tripStats = await TripModel.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          tripCount: { $sum: 1 },
          totalDistance: { $sum: '$distance' },
          totalFuel: { $sum: { $ifNull: ['$fuelConsumed', 0] } },
          completedTrips: {
            $sum: { $cond: [{ $eq: ['$status', TripStatus.COMPLETED] }, 1, 0] },
          },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return tripStats.map(stat => ({
      month: monthNames[stat._id.month - 1],
      year: stat._id.year,
      tripCount: stat.tripCount,
      distance: stat.totalDistance,
      fuelConsumed: stat.totalFuel,
      completedTrips: stat.completedTrips,
    }));
  }

  /**
   * Get driver performance stats
   */
  async getDriverStats(limit = 5) {
    const driverStats = await TripModel.aggregate([
      {
        $match: {
          status: TripStatus.COMPLETED,
        },
      },
      {
        $group: {
          _id: '$driver',
          tripCount: { $sum: 1 },
          totalDistance: { $sum: '$distance' },
          totalFuel: { $sum: { $ifNull: ['$fuelConsumed', 0] } },
        },
      },
      { $sort: { tripCount: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'driver',
        },
      },
      { $unwind: '$driver' },
    ]);

    return driverStats.map(stat => ({
      driverId: stat._id,
      name: `${stat.driver.firstName} ${stat.driver.lastName}`,
      tripCount: stat.tripCount,
      totalDistance: stat.totalDistance,
      totalFuel: stat.totalFuel,
      avgFuelPerTrip: stat.tripCount > 0 ? (stat.totalFuel / stat.tripCount).toFixed(2) : 0,
    }));
  }
}
