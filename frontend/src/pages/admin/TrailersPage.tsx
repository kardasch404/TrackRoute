import { useReducer, useCallback, useState } from 'react';
import { Plus, AlertTriangle } from 'lucide-react';
import { useAppDispatch } from '../../app/hooks';
import { openModal } from '../../features/trailers/trailersSlice';
import { useTrailers } from '../../hooks/useTrailers';
import { useDeleteTrailer } from '../../hooks/useTrailerMutations';
import TrailerList from '../../components/trailers/TrailerList';
import TrailerFilters from '../../components/trailers/TrailerFilters';
import TrailerModal from '../../components/trailers/TrailerModal';
import type { Trailer, TrailersFilter, TrailerStatus, FilterAction } from '../../features/trailers/trailersTypes';
import { useDebounce } from '../../hooks/useDebounce';

const initialFilters: TrailersFilter = {
  status: '',
  search: '',
  page: 1,
  limit: 12,
};

function filterReducer(state: TrailersFilter, action: FilterAction): TrailersFilter {
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

export default function TrailersPage() {
  const dispatch = useAppDispatch();
  const [filters, dispatchFilter] = useReducer(filterReducer, initialFilters);
  const [deleteConfirm, setDeleteConfirm] = useState<Trailer | null>(null);

  const debouncedSearch = useDebounce(filters.search, 300);
  const queryFilters = { ...filters, search: debouncedSearch };

  const { data, isLoading, error, refetch } = useTrailers(queryFilters);
  const deleteMutation = useDeleteTrailer();

  const handleStatusChange = useCallback((status: TrailerStatus | '') => {
    dispatchFilter({ type: 'SET_STATUS', payload: status });
  }, []);

  const handleSearchChange = useCallback((search: string) => {
    dispatchFilter({ type: 'SET_SEARCH', payload: search });
  }, []);

  const handleCreateTrailer = () => {
    dispatch(openModal({ mode: 'create' }));
  };

  const handleViewTrailer = (trailer: Trailer) => {
    dispatch(openModal({ mode: 'view', trailer }));
  };

  const handleEditTrailer = (trailer: Trailer) => {
    dispatch(openModal({ mode: 'edit', trailer }));
  };

  const handleDeleteClick = (trailer: Trailer) => {
    setDeleteConfirm(trailer);
  };

  const handleConfirmDelete = async () => {
    if (deleteConfirm) {
      try {
        await deleteMutation.mutateAsync(deleteConfirm._id);
        setDeleteConfirm(null);
      } catch (error) {
        console.error('Error deleting trailer:', error);
      }
    }
  };

  const trailers = data?.data || [];

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
        <p className="text-red-600 text-lg">Error loading trailers</p>
        <button
          onClick={() => refetch()}
          className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
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
          <h1 className="text-3xl font-bold text-gray-900">Trailers</h1>
          <p className="text-gray-500 mt-1">Manage your fleet of trailers</p>
        </div>
        <button
          onClick={handleCreateTrailer}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
        >
          <Plus className="w-5 h-5" />
          Add Trailer
        </button>
      </div>

      {/* Filters */}
      <TrailerFilters
        status={filters.status || ''}
        search={filters.search || ''}
        onStatusChange={handleStatusChange}
        onSearchChange={handleSearchChange}
      />

      {/* Trailer List */}
      <TrailerList
        trailers={trailers}
        isLoading={isLoading}
        onView={handleViewTrailer}
        onEdit={handleEditTrailer}
        onDelete={handleDeleteClick}
      />

      {/* Trailer Modal */}
      <TrailerModal />

      {/* Delete Confirmation Dialog */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/50" onClick={() => setDeleteConfirm(null)} />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-white rounded-xl shadow-xl p-6 max-w-sm w-full">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Trailer</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete trailer{' '}
                <span className="font-medium">{deleteConfirm.registration}</span>? This action
                cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  disabled={deleteMutation.isPending}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
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
