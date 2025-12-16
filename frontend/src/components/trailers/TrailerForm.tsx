import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { TrailerFormData, TrailerStatus } from '../../features/trailers/trailersTypes';

const trailerSchema = z.object({
  registration: z
    .string()
    .min(1, 'Registration is required')
    .max(20, 'Registration must be less than 20 characters'),
  type: z.string().min(1, 'Type is required'),
  capacity: z.number({ message: 'Capacity is required' }).positive('Capacity must be positive'),
  currentKm: z.number().min(0, 'Current Km cannot be negative').optional(),
  status: z.enum(['AVAILABLE', 'IN_USE', 'MAINTENANCE', 'OUT_OF_SERVICE']).optional(),
});

interface TrailerFormProps {
  initialData?: Partial<TrailerFormData>;
  onSubmit: (data: TrailerFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  mode: 'create' | 'edit';
}

const statusOptions: { value: TrailerStatus; label: string }[] = [
  { value: 'AVAILABLE', label: 'Available' },
  { value: 'IN_USE', label: 'In Use' },
  { value: 'MAINTENANCE', label: 'Maintenance' },
  { value: 'OUT_OF_SERVICE', label: 'Out of Service' },
];

const trailerTypes = [
  'Flatbed',
  'Refrigerated',
  'Dry Van',
  'Tanker',
  'Lowboy',
  'Step Deck',
  'Container',
  'Other',
];

export default function TrailerForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
  mode,
}: TrailerFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TrailerFormData>({
    resolver: zodResolver(trailerSchema),
    defaultValues: {
      registration: initialData?.registration || '',
      type: initialData?.type || '',
      capacity: initialData?.capacity || 0,
      currentKm: initialData?.currentKm || 0,
      status: initialData?.status || 'AVAILABLE',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Registration */}
      <div>
        <label htmlFor="registration" className="block text-sm font-medium text-gray-700 mb-1">
          Registration *
        </label>
        <input
          {...register('registration')}
          type="text"
          id="registration"
          placeholder="e.g., TRL-001-MA"
          className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition ${
            errors.registration ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.registration && (
          <p className="mt-1 text-sm text-red-600">{errors.registration.message}</p>
        )}
      </div>

      {/* Type */}
      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
          Type *
        </label>
        <select
          {...register('type')}
          id="type"
          className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition bg-white ${
            errors.type ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">Select a type</option>
          {trailerTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>}
      </div>

      {/* Capacity */}
      <div>
        <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-1">
          Capacity (m³) *
        </label>
        <input
          {...register('capacity', { valueAsNumber: true })}
          type="number"
          id="capacity"
          placeholder="e.g., 80"
          className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition ${
            errors.capacity ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.capacity && <p className="mt-1 text-sm text-red-600">{errors.capacity.message}</p>}
      </div>

      {/* Current Km */}
      <div>
        <label htmlFor="currentKm" className="block text-sm font-medium text-gray-700 mb-1">
          Current Km
        </label>
        <input
          {...register('currentKm', { valueAsNumber: true })}
          type="number"
          id="currentKm"
          placeholder="e.g., 50000"
          className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition ${
            errors.currentKm ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.currentKm && (
          <p className="mt-1 text-sm text-red-600">{errors.currentKm.message}</p>
        )}
      </div>

      {/* Status */}
      {mode === 'edit' && (
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            {...register('status')}
            id="status"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition bg-white"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Saving...' : mode === 'create' ? 'Create Trailer' : 'Update Trailer'}
        </button>
      </div>
    </form>
  );
}
