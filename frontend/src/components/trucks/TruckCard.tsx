import { Truck, Eye, Edit, Trash2 } from 'lucide-react';
import type { Truck as TruckType, TruckStatus } from '../../features/trucks/trucksTypes';

interface TruckCardProps {
  truck: TruckType;
  onView: (truck: TruckType) => void;
  onEdit: (truck: TruckType) => void;
  onDelete: (truck: TruckType) => void;
}

const statusColors: Record<TruckStatus, string> = {
  AVAILABLE: 'bg-green-100 text-green-800',
  IN_USE: 'bg-blue-100 text-blue-800',
  MAINTENANCE: 'bg-yellow-100 text-yellow-800',
  OUT_OF_SERVICE: 'bg-red-100 text-red-800',
};

const statusLabels: Record<TruckStatus, string> = {
  AVAILABLE: 'Available',
  IN_USE: 'In Use',
  MAINTENANCE: 'Maintenance',
  OUT_OF_SERVICE: 'Out of Service',
};

export default function TruckCard({ truck, onView, onEdit, onDelete }: TruckCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Truck className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{truck.registration}</h3>
            <p className="text-sm text-gray-500">
              {truck.brand} {truck.model}
            </p>
          </div>
        </div>
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[truck.status]}`}
        >
          {statusLabels[truck.status]}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-500">Year:</span>
          <span className="ml-2 font-medium">{truck.year}</span>
        </div>
        <div>
          <span className="text-gray-500">Fuel Capacity:</span>
          <span className="ml-2 font-medium">{truck.fuelCapacity}L</span>
        </div>
        <div className="col-span-2">
          <span className="text-gray-500">Current KM:</span>
          <span className="ml-2 font-medium">{truck.currentKm.toLocaleString()} km</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end gap-2">
        <button
          onClick={() => onView(truck)}
          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
          title="View"
        >
          <Eye className="w-4 h-4" />
        </button>
        <button
          onClick={() => onEdit(truck)}
          className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition"
          title="Edit"
        >
          <Edit className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(truck)}
          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
