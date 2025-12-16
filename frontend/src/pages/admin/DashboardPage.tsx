import { Truck, MapPin, Wrench, Users, Package, Route } from 'lucide-react';
import StatsCard from '../../components/dashboard/StatsCard';
import FleetOverview from '../../components/dashboard/FleetOverview';
import RecentTrips from '../../components/dashboard/RecentTrips';
import FuelConsumptionChart from '../../components/dashboard/FuelConsumptionChart';
import Spinner from '../../components/common/Spinner';
import { useDashboardStats } from '../../hooks/useDashboardStats';

export default function DashboardPage() {
  const { data, isLoading, error } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="text-red-500 text-lg mb-2">Failed to load dashboard</div>
        <p className="text-gray-500">Please try refreshing the page</p>
      </div>
    );
  }

  const stats = data || {
    fleet: { trucks: { total: 0 }, trailers: { total: 0 } },
    drivers: { active: 0 },
    trips: { active: 0, completed: 0 },
    alerts: { total: 0 },
    performance: { totalDistance: 0 },
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back! Here's your fleet overview.</p>
        </div>
      </div>
      
      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatsCard 
          title="Total Trucks" 
          value={stats.fleet.trucks.total} 
          icon={<Truck size={24} />}
          color="blue"
        />
        <StatsCard 
          title="Total Trailers" 
          value={stats.fleet.trailers.total} 
          icon={<Package size={24} />}
          color="indigo"
        />
        <StatsCard 
          title="Active Drivers" 
          value={stats.drivers.active} 
          icon={<Users size={24} />}
          color="green"
        />
        <StatsCard 
          title="Active Trips" 
          value={stats.trips.active} 
          icon={<MapPin size={24} />}
          color="orange"
        />
        <StatsCard 
          title="Completed Trips" 
          value={stats.trips.completed} 
          icon={<Route size={24} />}
          color="teal"
        />
        <StatsCard 
          title="Maintenance Alerts" 
          value={stats.alerts.total} 
          icon={<Wrench size={24} />}
          color={stats.alerts.total > 0 ? "red" : "gray"}
        />
      </div>

      {/* Performance Summary */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 text-white">
        <h2 className="text-lg font-semibold mb-4">Performance Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-blue-200 text-sm">Total Distance</p>
            <p className="text-2xl font-bold">{stats.performance.totalDistance.toLocaleString()} km</p>
          </div>
          <div>
            <p className="text-blue-200 text-sm">Fuel Consumed</p>
            <p className="text-2xl font-bold">{(stats.performance.totalFuelConsumed || 0).toLocaleString()} L</p>
          </div>
          <div>
            <p className="text-blue-200 text-sm">Avg. Fuel Efficiency</p>
            <p className="text-2xl font-bold">{stats.performance.avgFuelEfficiency || 0} L/100km</p>
          </div>
          <div>
            <p className="text-blue-200 text-sm">Fleet Utilization</p>
            <p className="text-2xl font-bold">
              {stats.fleet.trucks.total > 0 
                ? Math.round((stats.fleet.trucks.inUse / stats.fleet.trucks.total) * 100)
                : 0}%
            </p>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <FleetOverview />
        <div className="lg:col-span-2">
          <FuelConsumptionChart />
        </div>
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 gap-6">
        <RecentTrips />
      </div>
    </div>
  );
}
