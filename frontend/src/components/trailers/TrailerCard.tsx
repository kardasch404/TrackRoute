import { Eye, Edit2, Trash2, Truck } from 'lucide-react';
import type { Trailer } from '../../features/trailers/trailersTypes';

interface TrailerCardProps {
  trailer: Trailer;
  onView: (trailer: Trailer) => void;
  onEdit: (trailer: Trailer) => void;
  onDelete: (trailer: Trailer) => void;
}

const statusColors: Record<string, string> = {
  AVAILABLE: 'bg-green-100 text-green-800',
  IN_USE: 'bg-blue-100 text-blue-800',
  MAINTENANCE: 'bg-yellow-100 text-yellow-800',
  OUT_OF_SERVICE: 'bg-red-100 text-red-800',
};

const statusLabels: Record<string, string> = {
  AVAILABLE: 'Available',
  IN_USE: 'In Use',
  MAINTENANCE: 'Maintenance',
  OUT_OF_SERVICE: 'Out of Service',
};

export default function TrailerCard({ trailer, onView, onEdit, onDelete }: TrailerCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Truck className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{trailer.registration}</h3>
            <p className="text-sm text-gray-500">{trailer.type}</p>
          </div>
        </div>
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-medium ${
            statusColors[trailer.status] || 'bg-gray-100 text-gray-800'
          }`}
        >
          {statusLabels[trailer.status] || trailer.status}
        </span>
      </div>

      {/* Details */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Capacity</span>
          <span className="text-gray-900 font-medium">{trailer.capacity.toLocaleString()} m³</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Current Km</span>
          <span className="text-gray-900 font-medium">{trailer.currentKm.toLocaleString()} km</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
        <button
          onClick={() => onView(trailer)}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition"
        >
          <Eye className="w-4 h-4" />
          View
        </button>
        <button
          onClick={() => onEdit(trailer)}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition"
        >
          <Edit2 className="w-4 h-4" />
          Edit
        </button>
        <button
          onClick={() => onDelete(trailer)}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition"
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </button>
      </div>
    </div>
  );
}
