import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Truck, Clock, CheckCircle, Play, XCircle } from 'lucide-react';
import { useMyTrips, useTripMutations } from '../../hooks/useDriverTrips';
import type { TripStatus } from '../../features/trips/tripsTypes';

const statusConfig: Record<string, { label: string; color: string; bgColor: string; icon: React.ReactNode }> = {
  PLANNED: {
    label: 'Planned',
    color: 'text-yellow-800',
    bgColor: 'bg-yellow-100',
    icon: <Clock size={16} />,
  },
  IN_PROGRESS: {
    label: 'In Progress',
    color: 'text-blue-800',
    bgColor: 'bg-blue-100',
    icon: <Play size={16} />,
  },
  COMPLETED: {
    label: 'Completed',
    color: 'text-green-800',
    bgColor: 'bg-green-100',
    icon: <CheckCircle size={16} />,
  },
  CANCELLED: {
    label: 'Cancelled',
    color: 'text-red-800',
    bgColor: 'bg-red-100',
    icon: <XCircle size={16} />,
  },
};

export default function MyTripsPage() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<TripStatus | ''>('');
  const { data: trips, isLoading, error, refetch } = useMyTrips();
  const { startTrip, completeTrip } = useTripMutations();

  const filteredTrips = trips?.filter((trip) => 
    statusFilter === '' || trip.status === statusFilter
  ) || [];

  const handleStartTrip = async (tripId: string) => {
    if (!confirm('Are you sure you want to start this trip?')) return;
    try {
      await startTrip.mutateAsync(tripId);
      refetch();
    } catch (err) {
      alert('Failed to start trip. Please try again.');
    }
  };

  const handleCompleteTrip = async (tripId: string, startKm: number, distance: number) => {
    const expectedEndKm = startKm + distance;
    const inputKm = prompt(
      `Enter the ending odometer reading (km):\n\nStarting KM: ${startKm.toLocaleString()}\nPlanned distance: ${distance} km\nExpected ending KM: ~${expectedEndKm.toLocaleString()}`,
      expectedEndKm.toString()
    );
    if (!inputKm) return;
    
    // Remove commas and parse as number
    const km = parseInt(inputKm.replace(/,/g, ''));
    if (isNaN(km)) {
      alert('Please enter a valid number.');
      return;
    }
    
    if (km <= startKm) {
      alert(`Ending odometer (${km.toLocaleString()} km) must be greater than starting odometer (${startKm.toLocaleString()} km).`);
      return;
    }

    try {
      console.log('Completing trip:', { tripId, endKm: km });
      await completeTrip.mutateAsync({ tripId, endKm: km });
      refetch();
    } catch (err) {
      console.error('Failed to complete trip:', err);
      alert('Failed to complete trip. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Trips</h1>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Trips</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600">Failed to load your trips. Please try again.</p>
          <button
            onClick={() => refetch()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Trips</h1>
          <p className="text-gray-600">View and manage your assigned trips</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">Filter by status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as TripStatus | '')}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Trips</option>
            <option value="PLANNED">Planned</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Trips List */}
      {filteredTrips.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <MapPin size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No trips found</h3>
          <p className="text-gray-500">
            {statusFilter ? `No ${statusFilter.toLowerCase()} trips.` : 'You have no trips assigned yet.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTrips.map((trip) => {
            const config = statusConfig[trip.status] || statusConfig.PLANNED;
            const truck = trip.truck as { registration?: string; brand?: string; model?: string } | undefined;
            
            return (
              <div
                key={trip._id}
                className="bg-white rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-gray-900">{trip.code}</h3>
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bgColor} ${config.color}`}>
                          {config.icon}
                          {config.label}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Created: {new Date(trip.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      {trip.status === 'PLANNED' && (
                        <button
                          onClick={() => handleStartTrip(trip._id)}
                          disabled={startTrip.isPending}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                        >
                          <Play size={16} />
                          Start Trip
                        </button>
                      )}
                      {trip.status === 'IN_PROGRESS' && (
                        <button
                          onClick={() => handleCompleteTrip(trip._id, trip.startKm, trip.distance)}
                          disabled={completeTrip.isPending}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                        >
                          <CheckCircle size={16} />
                          Complete Trip
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Route */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-gray-700">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="font-medium">{trip.origin}</span>
                      </div>
                      <div className="border-l-2 border-dashed border-gray-300 h-6 ml-1.5"></div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="font-medium">{trip.destination}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">{trip.distance} km</p>
                      <p className="text-sm text-gray-500">Distance</p>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Truck</p>
                      <p className="text-sm font-medium text-gray-900 flex items-center gap-1">
                        <Truck size={14} />
                        {truck?.registration || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Start KM</p>
                      <p className="text-sm font-medium text-gray-900">
                        {trip.startKm?.toLocaleString() || 0} km
                      </p>
                    </div>
                    {trip.endKm && (
                      <div>
                        <p className="text-xs text-gray-500 uppercase">End KM</p>
                        <p className="text-sm font-medium text-gray-900">
                          {trip.endKm.toLocaleString()} km
                        </p>
                      </div>
                    )}
                    {trip.fuelConsumed && (
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Fuel Used</p>
                        <p className="text-sm font-medium text-gray-900">
                          {trip.fuelConsumed} L
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
