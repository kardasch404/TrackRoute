import Card from '../common/Card';
import Badge from '../common/Badge';
import { useFleetOverview } from '../../hooks/useDashboardStats';

const statusVariant: Record<string, 'success' | 'info' | 'warning' | 'danger'> = {
  AVAILABLE: 'success',
  IN_USE: 'info',
  MAINTENANCE: 'warning',
  OUT_OF_SERVICE: 'danger',
};

const statusLabel: Record<string, string> = {
  AVAILABLE: 'Available',
  IN_USE: 'In Use',
  MAINTENANCE: 'Maintenance',
  OUT_OF_SERVICE: 'Out of Service',
};

export default function FleetOverview() {
  const { data, isLoading, error } = useFleetOverview();

  if (isLoading) {
    return (
      <Card>
        <h3 className="text-lg font-semibold mb-4">Fleet Overview</h3>
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-6 bg-gray-200 rounded"></div>
          ))}
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <h3 className="text-lg font-semibold mb-4">Fleet Overview</h3>
        <p className="text-red-500 text-sm">Failed to load fleet data</p>
      </Card>
    );
  }

  const trucks = data?.trucks || [];
  const trailers = data?.trailers || [];

  return (
    <Card>
      <h3 className="text-lg font-semibold mb-4">Fleet Overview</h3>
      
      {/* Trucks Section */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-500 mb-2">Trucks</h4>
        <div className="space-y-2">
          {trucks.length > 0 ? trucks.map((item) => (
            <div key={item.status} className="flex justify-between items-center">
              <span className="text-gray-700">{statusLabel[item.status] || item.status}</span>
              <Badge variant={statusVariant[item.status] || 'info'}>{item.count}</Badge>
            </div>
          )) : (
            <p className="text-gray-400 text-sm">No trucks</p>
          )}
        </div>
      </div>

      {/* Trailers Section */}
      <div>
        <h4 className="text-sm font-medium text-gray-500 mb-2">Trailers</h4>
        <div className="space-y-2">
          {trailers.length > 0 ? trailers.map((item) => (
            <div key={item.status} className="flex justify-between items-center">
              <span className="text-gray-700">{statusLabel[item.status] || item.status}</span>
              <Badge variant={statusVariant[item.status] || 'info'}>{item.count}</Badge>
            </div>
          )) : (
            <p className="text-gray-400 text-sm">No trailers</p>
          )}
        </div>
      </div>
    </Card>
  );
}
