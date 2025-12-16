import { Truck, Calendar, Gauge } from 'lucide-react';
import type { Trailer } from '../../features/trailers/trailersTypes';

interface TrailerDetailsProps {
  trailer: Trailer;
  onClose: () => void;
  onEdit: () => void;
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

export default function TrailerDetails({ trailer, onClose, onEdit }: TrailerDetailsProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="p-3 bg-purple-100 rounded-xl">
          <Truck className="w-8 h-8 text-purple-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{trailer.registration}</h2>
          <p className="text-gray-500">{trailer.type}</p>
        </div>
        <span
          className={`ml-auto px-3 py-1.5 rounded-full text-sm font-medium ${
            statusColors[trailer.status] || 'bg-gray-100 text-gray-800'
          }`}
        >
          {statusLabels[trailer.status] || trailer.status}
        </span>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <Gauge className="w-4 h-4" />
            <span className="text-sm">Capacity</span>
          </div>
          <p className="text-lg font-semibold text-gray-900">{trailer.capacity.toLocaleString()} m³</p>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <Gauge className="w-4 h-4" />
            <span className="text-sm">Current Km</span>
          </div>
          <p className="text-lg font-semibold text-gray-900">
            {trailer.currentKm.toLocaleString()} km
          </p>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">Created</span>
          </div>
          <p className="text-lg font-semibold text-gray-900">
            {new Date(trailer.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">Last Updated</span>
          </div>
          <p className="text-lg font-semibold text-gray-900">
            {new Date(trailer.updatedAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <button
          onClick={onClose}
          className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
        >
          Close
        </button>
        <button
          onClick={onEdit}
          className="flex-1 px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
        >
          Edit Trailer
        </button>
      </div>
    </div>
  );
}
