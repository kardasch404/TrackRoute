import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import { useDriverStats, useTripMutations } from '../../hooks/useDriverTrips';
import { MapPin, Truck, Clock, CheckCircle, Play, Route, ArrowRight } from 'lucide-react';

export default function DriverDashboardPage() {
  const user = useAppSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const { data: stats, isLoading, error } = useDriverStats();
  const { startTrip } = useTripMutations();

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-6 h-24"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600">Failed to load dashboard. Please refresh the page.</p>
        </div>
      </div>
    );
  }

  const handleStartTrip = async (tripId: string) => {
    if (!confirm('Are you sure you want to start this trip?')) return;
    try {
      await startTrip.mutateAsync(tripId);
    } catch {
      alert('Failed to start trip. Please try again.');
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.firstName}!
        </h1>
        <p className="text-gray-600">Here's an overview of your activity.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="bg-yellow-500 p-3 rounded-lg">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Planned Trips</p>
              <p className="text-2xl font-semibold text-gray-900">{stats?.planned || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="bg-blue-500 p-3 rounded-lg">
              <Play className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">In Progress</p>
              <p className="text-2xl font-semibold text-gray-900">{stats?.inProgress || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="bg-green-500 p-3 rounded-lg">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Completed</p>
              <p className="text-2xl font-semibold text-gray-900">{stats?.completed || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="bg-purple-500 p-3 rounded-lg">
              <Route className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Distance</p>
              <p className="text-2xl font-semibold text-gray-900">{stats?.totalDistance?.toLocaleString() || 0} km</p>
            </div>
          </div>
        </div>
      </div>

      {/* Current Trip */}
      {stats?.currentTrip && (
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 text-white mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-lg font-semibold mb-1">Current Trip</h2>
              <p className="text-blue-200 text-sm">{stats.currentTrip.code}</p>
            </div>
            <span className="bg-blue-400/30 px-3 py-1 rounded-full text-sm">In Progress</span>
          </div>
          <div className="mt-4 flex items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span>{stats.currentTrip.origin}</span>
              </div>
              <div className="border-l-2 border-dashed border-blue-400/50 h-4 ml-1.5"></div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <span>{stats.currentTrip.destination}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">{stats.currentTrip.distance} km</p>
              <p className="text-blue-200 text-sm">Distance</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/driver/my-trips')}
            className="mt-4 bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition"
          >
            View Details
          </button>
        </div>
      )}

      {/* Next Planned Trip */}
      {stats?.nextTrip && !stats?.currentTrip && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 border-l-4 border-yellow-500">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Next Planned Trip</h2>
              <p className="text-gray-500 text-sm">{stats.nextTrip.code}</p>
            </div>
            <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
              Ready to Start
            </span>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MapPin className="text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">{stats.nextTrip.origin}</p>
                <p className="text-sm text-gray-500">→ {stats.nextTrip.destination}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-lg font-bold text-gray-900">{stats.nextTrip.distance} km</span>
              <button
                onClick={() => handleStartTrip(stats.nextTrip!._id)}
                disabled={startTrip.isPending}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
              >
                <Play size={16} />
                Start Trip
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => navigate('/driver/my-trips')}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <MapPin className="h-5 w-5 mr-2" />
            View All Trips
          </button>
        </div>
      </div>

      {/* Recent Trips */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Trips</h2>
          <button
            onClick={() => navigate('/driver/my-trips')}
            className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
          >
            View All <ArrowRight size={14} />
          </button>
        </div>
        
        {stats?.recentTrips && stats.recentTrips.length > 0 ? (
          <div className="space-y-3">
            {stats.recentTrips.slice(0, 3).map((trip) => (
              <div
                key={trip._id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-full ${
                    trip.status === 'COMPLETED' ? 'bg-green-100 text-green-600' :
                    trip.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-600' :
                    'bg-yellow-100 text-yellow-600'
                  }`}>
                    {trip.status === 'COMPLETED' ? <CheckCircle size={20} /> :
                     trip.status === 'IN_PROGRESS' ? <Play size={20} /> :
                     <Clock size={20} />}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{trip.code}</p>
                    <p className="text-sm text-gray-500">{trip.origin} → {trip.destination}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{trip.distance} km</p>
                  <p className="text-xs text-gray-500">{trip.status}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <MapPin className="mx-auto h-12 w-12 text-gray-400 mb-3" />
            <p>No trips assigned yet.</p>
            <p className="text-sm">Your assigned trips will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
