import { X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  closeModal,
  selectIsModalOpen,
  selectModalMode,
  selectSelectedTrailer,
  openModal,
} from '../../features/trailers/trailersSlice';
import { useCreateTrailer, useUpdateTrailer } from '../../hooks/useTrailerMutations';
import TrailerForm from './TrailerForm';
import TrailerDetails from './TrailerDetails';
import type { TrailerFormData } from '../../features/trailers/trailersTypes';

export default function TrailerModal() {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(selectIsModalOpen);
  const mode = useAppSelector(selectModalMode);
  const selectedTrailer = useAppSelector(selectSelectedTrailer);

  const createMutation = useCreateTrailer();
  const updateMutation = useUpdateTrailer();

  const handleClose = () => {
    dispatch(closeModal());
  };

  const handleSubmit = async (data: TrailerFormData) => {
    try {
      if (mode === 'create') {
        await createMutation.mutateAsync(data);
      } else if (mode === 'edit' && selectedTrailer) {
        await updateMutation.mutateAsync({ id: selectedTrailer._id, data });
      }
      handleClose();
    } catch (error) {
      console.error('Error saving trailer:', error);
    }
  };

  const handleEdit = () => {
    if (selectedTrailer) {
      dispatch(openModal({ mode: 'edit', trailer: selectedTrailer }));
    }
  };

  if (!isOpen) return null;

  const title = mode === 'create' ? 'Add New Trailer' : mode === 'edit' ? 'Edit Trailer' : 'Trailer Details';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={handleClose} />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            <button
              onClick={handleClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {mode === 'view' && selectedTrailer ? (
              <TrailerDetails trailer={selectedTrailer} onClose={handleClose} onEdit={handleEdit} />
            ) : (
              <TrailerForm
                mode={mode === 'create' ? 'create' : 'edit'}
                initialData={selectedTrailer || undefined}
                onSubmit={handleSubmit}
                onCancel={handleClose}
                isLoading={createMutation.isPending || updateMutation.isPending}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
