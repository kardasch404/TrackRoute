import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { TruckFormData, Truck } from '../../features/trucks/trucksTypes';

const truckSchema = z.object({
  registration: z
    .string()
    .min(1, 'Registration is required')
    .max(20, 'Registration must be 20 characters or less')
    .transform((val) => val.toUpperCase()),
  brand: z.string().min(1, 'Brand is required').max(50, 'Brand must be 50 characters or less'),
  model: z.string().min(1, 'Model is required').max(50, 'Model must be 50 characters or less'),
  year: z
    .number({ message: 'Year must be a number' })
    .min(1900, 'Year must be 1900 or later')
    .max(new Date().getFullYear() + 1, 'Year cannot be in the future'),
  fuelCapacity: z
    .number({ message: 'Fuel capacity must be a number' })
    .min(1, 'Fuel capacity must be at least 1L')
    .max(2000, 'Fuel capacity must be 2000L or less'),
  currentKm: z
    .number({ message: 'Current KM must be a number' })
    .min(0, 'Current KM cannot be negative')
    .optional(),
  status: z.enum(['AVAILABLE', 'IN_USE', 'MAINTENANCE', 'OUT_OF_SERVICE']).optional(),
});

interface TruckFormProps {
  truck?: Truck;
  onSubmit: (data: TruckFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function TruckForm({ truck, onSubmit, onCancel, isLoading }: TruckFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TruckFormData>({
    resolver: zodResolver(truckSchema),
    defaultValues: truck
      ? {
          registration: truck.registration,
          brand: truck.brand,
          model: truck.model,
          year: truck.year,
          fuelCapacity: truck.fuelCapacity,
          currentKm: truck.currentKm,
          status: truck.status,
        }
      : {
          registration: '',
          brand: '',
          model: '',
          year: new Date().getFullYear(),
          fuelCapacity: 400,
          currentKm: 0,
          status: 'AVAILABLE',
        },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Registration <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          {...register('registration')}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none uppercase ${
            errors.registration ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="ABC-123-XY"
        />
        {errors.registration && (
          <p className="mt-1 text-sm text-red-500">{errors.registration.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Brand <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register('brand')}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
              errors.brand ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Volvo"
          />
          {errors.brand && <p className="mt-1 text-sm text-red-500">{errors.brand.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Model <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register('model')}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
              errors.model ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="FH16"
          />
          {errors.model && <p className="mt-1 text-sm text-red-500">{errors.model.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Year <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            {...register('year', { valueAsNumber: true })}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
              errors.year ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="2023"
          />
          {errors.year && <p className="mt-1 text-sm text-red-500">{errors.year.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fuel Capacity (L) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            {...register('fuelCapacity', { valueAsNumber: true })}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
              errors.fuelCapacity ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="400"
          />
          {errors.fuelCapacity && (
            <p className="mt-1 text-sm text-red-500">{errors.fuelCapacity.message}</p>
          )}
        </div>
      </div>

      {truck && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current KM</label>
            <input
              type="number"
              {...register('currentKm', { valueAsNumber: true })}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                errors.currentKm ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="0"
            />
            {errors.currentKm && (
              <p className="mt-1 text-sm text-red-500">{errors.currentKm.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              {...register('status')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="AVAILABLE">Available</option>
              <option value="IN_USE">In Use</option>
              <option value="MAINTENANCE">Maintenance</option>
              <option value="OUT_OF_SERVICE">Out of Service</option>
            </select>
          </div>
        </div>
      )}

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Saving...' : truck ? 'Update Truck' : 'Create Truck'}
        </button>
      </div>
    </form>
  );
}
