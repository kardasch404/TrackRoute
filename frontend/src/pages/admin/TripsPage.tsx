import { useState } from 'react';
import type { Trip, TripFilters as TripFiltersType, TripStatus } from '../../features/trips/tripsTypes';
import { useTrips } from '../../hooks/useTrips';
import { useTripMutations } from '../../hooks/useTripMutations';
import TripList from '../../components/trips/TripList';
import TripFilters from '../../components/trips/TripFilters';
import TripModal from '../../components/trips/TripModal';
import CreateTripForm from '../../components/trips/CreateTripForm';
import { TripCreationProvider } from '../../features/trips/TripCreationContext';
import { useToast } from '../../hooks/useToast';

export default function TripsPage() {
  const [filters, setFilters] = useState<TripFiltersType>({});
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const { data: tripsData, isLoading, refetch } = useTrips(filters);
  const { deleteTrip, updateTripStatus } = useTripMutations();
  const { show: showToast } = useToast();

  const trips = tripsData || [];

  const handleFilterChange = (newFilters: TripFiltersType) => {
    setFilters(newFilters);
  };

  const handleViewTrip = (trip: Trip) => {
    setSelectedTrip(trip);
    setIsViewModalOpen(true);
  };

  const handleDeleteTrip = async (trip: Trip) => {
    if (!confirm(`Are you sure you want to delete trip ${trip.code}?`)) {
      return;
    }

    try {
      await deleteTrip.mutateAsync(trip._id);
      showToast('Trip deleted successfully', 'success');
      refetch();
    } catch {
      showToast('Failed to delete trip', 'error');
    }
  };

  const handleStatusChange = async (trip: Trip, status: TripStatus) => {
    try {
      await updateTripStatus.mutateAsync({ tripId: trip._id, status });
      showToast('Trip status updated', 'success');
      refetch();
    } catch {
      showToast('Failed to update status', 'error');
    }
  };

  const handleCreateSuccess = () => {
    setIsCreateModalOpen(false);
    showToast('Trip created successfully', 'success');
    refetch();
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Trip Management</h1>
          <p className="text-gray-600 mt-1">Create, manage, and track all trips</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Trip
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Total Trips</div>
          <div className="text-2xl font-bold text-gray-900">{trips.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Planned</div>
          <div className="text-2xl font-bold text-yellow-600">
            {trips.filter((t: Trip) => t.status === 'PLANNED').length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">In Progress</div>
          <div className="text-2xl font-bold text-blue-600">
            {trips.filter((t: Trip) => t.status === 'IN_PROGRESS').length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Completed</div>
          <div className="text-2xl font-bold text-green-600">
            {trips.filter((t: Trip) => t.status === 'COMPLETED').length}
          </div>
        </div>
      </div>

      {/* Filters */}
      <TripFilters filters={filters} onFilterChange={handleFilterChange} />

      {/* Trip List */}
      <TripList
        trips={trips}
        isLoading={isLoading}
        onView={handleViewTrip}
        onDelete={handleDeleteTrip}
        onStatusChange={(trip) => {
          if (trip.status === 'PLANNED') {
            handleStatusChange(trip, 'IN_PROGRESS');
          } else if (trip.status === 'IN_PROGRESS') {
            handleStatusChange(trip, 'COMPLETED');
          }
        }}
      />

      {/* Create Trip Modal */}
      <TripModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Trip"
        size="lg"
      >
        <TripCreationProvider>
          <CreateTripForm
            onSuccess={handleCreateSuccess}
            onClose={() => setIsCreateModalOpen(false)}
          />
        </TripCreationProvider>
      </TripModal>

      {/* View Trip Modal */}
      <TripModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Trip Details"
        size="lg"
      >
        {selectedTrip && (
          <div className="p-6">
            <div className="grid grid-cols-2 gap-6">
              {/* Trip Info */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Trip Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Trip Code:</span>
                    <span className="font-medium">{selectedTrip.code}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Status:</span>
                    <select
                      value={selectedTrip.status}
                      onChange={(e) => handleStatusChange(selectedTrip, e.target.value as TripStatus)}
                      className="text-sm border rounded px-2 py-1"
                    >
                      <option value="PLANNED">Planned</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Distance:</span>
                    <span className="font-medium">{selectedTrip.distance} km</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Start KM:</span>
                    <span className="font-medium">{selectedTrip.startKm?.toLocaleString()}</span>
                  </div>
                  {selectedTrip.endKm && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">End KM:</span>
                      <span className="font-medium">{selectedTrip.endKm.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Route Info */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Route</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-500">From:</span>
                    <p className="font-medium">{selectedTrip.origin}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">To:</span>
                    <p className="font-medium">{selectedTrip.destination}</p>
                  </div>
                </div>
              </div>

              {/* Assignment Info */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Assignment</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Driver:</span>
                    <span className="font-medium">
                      {selectedTrip.driver 
                        ? `${selectedTrip.driver.firstName} ${selectedTrip.driver.lastName}`
                        : 'Not assigned'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Truck:</span>
                    <span className="font-medium">
                      {selectedTrip.truck?.registration || 'Not assigned'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Trailer:</span>
                    <span className="font-medium">
                      {selectedTrip.trailer?.registration || 'Not assigned'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Dates Info */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Dates</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Created:</span>
                    <span className="font-medium">{new Date(selectedTrip.createdAt).toLocaleString()}</span>
                  </div>
                  {selectedTrip.startedAt && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Started:</span>
                      <span className="font-medium">{new Date(selectedTrip.startedAt).toLocaleString()}</span>
                    </div>
                  )}
                  {selectedTrip.completedAt && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Completed:</span>
                      <span className="font-medium">{new Date(selectedTrip.completedAt).toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6 pt-4 border-t">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </TripModal>
    </div>
  );
}
