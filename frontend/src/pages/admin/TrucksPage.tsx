import { useReducer, useCallback, useState } from 'react';
import { Plus, AlertTriangle } from 'lucide-react';
import { useAppDispatch } from '../../app/hooks';
import { openModal } from '../../features/trucks/trucksSlice';
import { useTrucks } from '../../hooks/useTrucks';
import { useDeleteTruck } from '../../hooks/useTruckMutations';
import TruckList from '../../components/trucks/TruckList';
import TruckFilters from '../../components/trucks/TruckFilters';
import TruckModal from '../../components/trucks/TruckModal';
import type { Truck, TrucksFilter, TruckStatus, FilterAction } from '../../features/trucks/trucksTypes';
import { useDebounce } from '../../hooks/useDebounce';

const initialFilters: TrucksFilter = {
  status: '',
  search: '',
  page: 1,
  limit: 12,
};

function filterReducer(state: TrucksFilter, action: FilterAction): TrucksFilter {
  switch (action.type) {
    case 'SET_STATUS':
      return { ...state, status: action.payload, page: 1 };
    case 'SET_SEARCH':
      return { ...state, search: action.payload, page: 1 };
    case 'SET_PAGE':
      return { ...state, page: action.payload };
    case 'RESET':
      return initialFilters;
    default:
      return state;
  }
}

export default function TrucksPage() {
  const dispatch = useAppDispatch();
  const [filters, dispatchFilter] = useReducer(filterReducer, initialFilters);
  const [deleteConfirm, setDeleteConfirm] = useState<Truck | null>(null);

  const debouncedSearch = useDebounce(filters.search, 300);
  const queryFilters = { ...filters, search: debouncedSearch };

  const { data, isLoading, error, refetch } = useTrucks(queryFilters);
  const deleteMutation = useDeleteTruck();

  const handleStatusChange = useCallback((status: TruckStatus | '') => {
    dispatchFilter({ type: 'SET_STATUS', payload: status });
  }, []);

  const handleSearchChange = useCallback((search: string) => {
    dispatchFilter({ type: 'SET_SEARCH', payload: search });
  }, []);

  const handlePageChange = useCallback((page: number) => {
    dispatchFilter({ type: 'SET_PAGE', payload: page });
  }, []);

  const handleCreateTruck = () => {
    dispatch(openModal({ mode: 'create' }));
  };

  const handleViewTruck = (truck: Truck) => {
    dispatch(openModal({ mode: 'view', truck }));
  };

  const handleEditTruck = (truck: Truck) => {
    dispatch(openModal({ mode: 'edit', truck }));
  };

  const handleDeleteClick = (truck: Truck) => {
    setDeleteConfirm(truck);
  };

  const handleConfirmDelete = async () => {
    if (deleteConfirm) {
      try {
        await deleteMutation.mutateAsync(deleteConfirm._id);
        setDeleteConfirm(null);
      } catch (error) {
        console.error('Error deleting truck:', error);
      }
    }
  };

  const trucks = data?.data || [];
  const totalPages = 1; // TODO: Add pagination to API
  const currentPage = filters.page;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
        <p className="text-red-600 text-lg">Error loading trucks</p>
        <button
          onClick={() => refetch()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Trucks</h1>
          <p className="text-gray-500 mt-1">Manage your fleet of trucks</p>
        </div>
        <button
          onClick={handleCreateTruck}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <Plus className="w-5 h-5" />
          Add Truck
        </button>
      </div>

      {/* Filters */}
      <TruckFilters
        status={filters.status || ''}
        search={filters.search || ''}
        onStatusChange={handleStatusChange}
        onSearchChange={handleSearchChange}
      />

      {/* Truck List */}
      <TruckList
        trucks={trucks}
        isLoading={isLoading}
        onView={handleViewTruck}
        onEdit={handleEditTruck}
        onDelete={handleDeleteClick}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 pt-6">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="flex items-center px-4 text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}

      {/* Modal */}
      <TruckModal onSuccess={() => refetch()} />

      {/* Delete Confirmation Dialog */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={() => setDeleteConfirm(null)}
            />
            <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md p-6 z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-100 rounded-full">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Delete Truck</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete truck{' '}
                <span className="font-semibold">{deleteConfirm.registration}</span>? This action
                cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  disabled={deleteMutation.isPending}
                  className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg transition disabled:opacity-50"
                >
                  {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
