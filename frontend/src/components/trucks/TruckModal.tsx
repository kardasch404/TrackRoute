import { X } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
  selectIsModalOpen,
  selectModalMode,
  selectSelectedTruck,
  closeModal,
} from '../../features/trucks/trucksSlice';
import TruckForm from './TruckForm';
import TruckDetails from './TruckDetails';
import { useCreateTruck, useUpdateTruck } from '../../hooks/useTruckMutations';
import type { TruckFormData } from '../../features/trucks/trucksTypes';

interface TruckModalProps {
  onSuccess?: () => void;
}

export default function TruckModal({ onSuccess }: TruckModalProps) {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(selectIsModalOpen);
  const mode = useAppSelector(selectModalMode);
  const selectedTruck = useAppSelector(selectSelectedTruck);

  const createMutation = useCreateTruck();
  const updateMutation = useUpdateTruck();

  const handleClose = () => {
    dispatch(closeModal());
  };

  const handleSubmit = async (data: TruckFormData) => {
    try {
      if (mode === 'edit' && selectedTruck) {
        await updateMutation.mutateAsync({ id: selectedTruck._id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      handleClose();
      onSuccess?.();
    } catch (error) {
      console.error('Error saving truck:', error);
    }
  };

  if (!isOpen) return null;

  const getTitle = () => {
    switch (mode) {
      case 'create':
        return 'Add New Truck';
      case 'edit':
        return 'Edit Truck';
      case 'view':
        return 'Truck Details';
      default:
        return 'Truck';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={handleClose}
        />

        {/* Modal */}
        <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg p-6 z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">{getTitle()}</h2>
            <button
              onClick={handleClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          {mode === 'view' && selectedTruck ? (
            <TruckDetails truck={selectedTruck} />
          ) : (
            <TruckForm
              truck={mode === 'edit' ? selectedTruck ?? undefined : undefined}
              onSubmit={handleSubmit}
              onCancel={handleClose}
              isLoading={createMutation.isPending || updateMutation.isPending}
            />
          )}
        </div>
      </div>
    </div>
  );
}
