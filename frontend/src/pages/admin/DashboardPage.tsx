import { useMemo } from 'react';
import { Truck, MapPin, Wrench, DollarSign } from 'lucide-react';
import StatsCard from '../../components/dashboard/StatsCard';
import FleetOverview from '../../components/dashboard/FleetOverview';
import RecentTrips from '../../components/dashboard/RecentTrips';
import MaintenanceAlerts from '../../components/dashboard/MaintenanceAlerts';
import FuelConsumptionChart from '../../components/dashboard/FuelConsumptionChart';
import Spinner from '../../components/common/Spinner';
import { useDashboardStats } from '../../hooks/useDashboardStats';

export default function DashboardPage() {
  const { data, isLoading, error } = useDashboardStats();

  const stats = useMemo(() => {
    if (!data) return { trucks: 0, trips: 0, alerts: 0, fuelCost: 0 };
    return {
      trucks: data.totalTrucks || 23,
      trips: data.activeTrips || 8,
      alerts: data.maintenanceAlerts || 5,
      fuelCost: data.fuelCost || 12500,
    };
  }, [data]);

  if (isLoading) return <div className="flex justify-center items-center h-screen"><Spinner size="lg" /></div>;
  if (error) return <div className="text-red-600">Error loading dashboard</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="Total Trucks" value={stats.trucks} icon={<Truck size={32} />} />
        <StatsCard title="Active Trips" value={stats.trips} icon={<MapPin size={32} />} />
        <StatsCard title="Maintenance Alerts" value={stats.alerts} icon={<Wrench size={32} />} />
        <StatsCard title="Fuel Cost" value={`$${stats.fuelCost}`} icon={<DollarSign size={32} />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <FleetOverview />
        <div className="lg:col-span-2">
          <FuelConsumptionChart />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentTrips />
        <MaintenanceAlerts />
      </div>
    </div>
  );
}
