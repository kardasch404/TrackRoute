import { useState } from 'react';
import type { Trip } from '../../features/trips/tripsTypes';
import { useTripMutations } from '../../hooks/useTripMutations';
import { useAvailableDrivers, useAvailableTrucks, useAvailableTrailers } from '../../hooks/useTrips';
import TripModal from './TripModal';
import TripStatusBadge from './TripStatusBadge';

interface AssignTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip: Trip | null;
  onSuccess: () => void;
}

export default function AssignTripModal({ isOpen, onClose, trip, onSuccess }: AssignTripModalProps) {
  const [driverId, setDriverId] = useState(trip?.driver?._id || '');
  const [truckId, setTruckId] = useState(trip?.truck?._id || '');
  const [trailerId, setTrailerId] = useState(trip?.trailer?._id || '');

  const { data: drivers, isLoading: loadingDrivers } = useAvailableDrivers();
  const { data: trucks, isLoading: loadingTrucks } = useAvailableTrucks();
  const { data: trailers, isLoading: loadingTrailers } = useAvailableTrailers();
  const { assignTrip } = useTripMutations();

  const handleSubmit = async () => {
    if (!trip) return;

    try {
      await assignTrip.mutateAsync({
        tripId: trip._id,
        driverId: driverId || undefined,
        truckId: truckId || undefined,
        trailerId: trailerId || undefined,
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to assign trip:', error);
    }
  };

  if (!trip) return null;

  return (
    <TripModal isOpen={isOpen} onClose={onClose} title="Assign Trip" size="md">
      <div className="p-6">
        {/* Trip Summary */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-gray-900">{trip.tripNumber}</span>
            <TripStatusBadge status={trip.status} size="sm" />
          </div>
          <div className="text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span className="font-medium">From:</span>
              <span>{trip.origin.city}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">To:</span>
              <span>{trip.destination.city}</span>
            </div>
          </div>
        </div>

        {/* Assignment Form */}
        <div className="space-y-4">
          {/* Driver */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Driver <span className="text-red-500">*</span>
            </label>
            <select
              value={driverId}
              onChange={(e) => setDriverId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              disabled={loadingDrivers}
            >
              <option value="">Select a driver</option>
              {drivers?.map((driver: { _id: string; firstName: string; lastName: string; email: string }) => (
                <option key={driver._id} value={driver._id}>
                  {driver.firstName} {driver.lastName}
                </option>
              ))}
            </select>
          </div>

          {/* Truck */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Truck <span className="text-red-500">*</span>
            </label>
            <select
              value={truckId}
              onChange={(e) => setTruckId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              disabled={loadingTrucks}
            >
              <option value="">Select a truck</option>
              {trucks?.map((truck: { _id: string; registration: string; brand: string; model: string }) => (
                <option key={truck._id} value={truck._id}>
                  {truck.registration} - {truck.brand} {truck.model}
                </option>
              ))}
            </select>
          </div>

          {/* Trailer */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Trailer
            </label>
            <select
              value={trailerId}
              onChange={(e) => setTrailerId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              disabled={loadingTrailers}
            >
              <option value="">Select a trailer (optional)</option>
              {trailers?.map((trailer: { _id: string; registration: string; type: string }) => (
                <option key={trailer._id} value={trailer._id}>
                  {trailer.registration} - {trailer.type}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6 pt-4 border-t">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!driverId || !truckId || assignTrip.isPending}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {assignTrip.isPending ? 'Assigning...' : 'Assign Trip'}
          </button>
        </div>
      </div>
    </TripModal>
  );
}
