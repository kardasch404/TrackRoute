import { useNavigate } from 'react-router-dom';
import Card from '../common/Card';
import Table from '../common/Table';
import Badge from '../common/Badge';
import { useRecentTrips } from '../../hooks/useDashboardStats';

const statusVariant: Record<string, 'success' | 'info' | 'warning' | 'danger'> = {
  PLANNED: 'warning',
  IN_PROGRESS: 'info',
  COMPLETED: 'success',
  CANCELLED: 'danger',
};

export default function RecentTrips() {
  const { data: trips, isLoading, error } = useRecentTrips(5);
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <Card>
        <h3 className="text-lg font-semibold mb-4">Recent Trips</h3>
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 bg-gray-200 rounded"></div>
          ))}
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <h3 className="text-lg font-semibold mb-4">Recent Trips</h3>
        <p className="text-red-500 text-sm">Failed to load recent trips</p>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Recent Trips</h3>
        <button
          onClick={() => navigate('/admin/trips')}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          View All →
        </button>
      </div>
      
      {trips && trips.length > 0 ? (
        <Table headers={['Code', 'Driver', 'Route', 'Status']}>
          {trips.map((trip) => (
            <tr key={trip._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 font-medium">{trip.code}</td>
              <td className="px-6 py-4">{trip.driver}</td>
              <td className="px-6 py-4">
                <span className="text-gray-600">{trip.origin}</span>
                <span className="mx-1">→</span>
                <span className="text-gray-600">{trip.destination}</span>
              </td>
              <td className="px-6 py-4">
                <Badge variant={statusVariant[trip.status] || 'info'}>{trip.status}</Badge>
              </td>
            </tr>
          ))}
        </Table>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>No trips yet</p>
          <button
            onClick={() => navigate('/admin/trips')}
            className="mt-2 text-blue-600 hover:text-blue-800"
          >
            Create your first trip
          </button>
        </div>
      )}
    </Card>
  );
}
