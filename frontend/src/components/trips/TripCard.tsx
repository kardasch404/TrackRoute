import type { Trip } from '../../features/trips/tripsTypes';
import TripStatusBadge from './TripStatusBadge';

interface TripCardProps {
  trip: Trip;
  onView: (trip: Trip) => void;
  onStatusChange?: (trip: Trip) => void;
  onDelete?: (trip: Trip) => void;
}

export default function TripCard({ trip, onView, onStatusChange, onDelete }: TripCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-5">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{trip.code}</h3>
          <p className="text-sm text-gray-500">
            Created: {new Date(trip.createdAt).toLocaleDateString()}
          </p>
        </div>
        <TripStatusBadge status={trip.status} />
      </div>

      {/* Route */}
      <div className="mb-4">
        <div className="flex items-start gap-2">
          <div className="flex flex-col items-center">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <div className="w-0.5 h-8 bg-gray-300"></div>
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
          </div>
          <div className="flex-1">
            <div className="mb-2">
              <p className="text-sm font-medium text-gray-900">{trip.origin}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{trip.destination}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Trip Info */}
      <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
        <div className="bg-gray-50 rounded p-2">
          <span className="text-gray-500">Distance:</span>
          <span className="ml-1 font-medium">{trip.distance} km</span>
        </div>
        <div className="bg-gray-50 rounded p-2">
          <span className="text-gray-500">Start KM:</span>
          <span className="ml-1 font-medium">{trip.startKm.toLocaleString()}</span>
        </div>
      </div>

      {/* Assignment Info */}
      <div className="border-t pt-3 mb-4">
        {trip.driver ? (
          <div className="flex items-center gap-2 text-sm">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 font-medium text-xs">
                {trip.driver.firstName?.[0]}{trip.driver.lastName?.[0]}
              </span>
            </div>
            <div>
              <p className="font-medium text-gray-900">
                {trip.driver.firstName} {trip.driver.lastName}
              </p>
              {trip.truck && (
                <p className="text-xs text-gray-500">{trip.truck.registration}</p>
              )}
            </div>
          </div>
        ) : (
          <p className="text-sm text-yellow-600 italic">Not assigned</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => onView(trip)}
          className="flex-1 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
        >
          View
        </button>
        {trip.status === 'PLANNED' && onStatusChange && (
          <button
            onClick={() => onStatusChange(trip)}
            className="flex-1 px-3 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Start
          </button>
        )}
        {trip.status === 'IN_PROGRESS' && onStatusChange && (
          <button
            onClick={() => onStatusChange(trip)}
            className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Complete
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(trip)}
            className="px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
            title="Delete trip"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
