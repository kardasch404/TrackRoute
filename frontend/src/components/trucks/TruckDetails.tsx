import { Truck, Calendar, Fuel, Gauge, MapPin } from 'lucide-react';
import type { Truck as TruckType, TruckStatus } from '../../features/trucks/trucksTypes';

interface TruckDetailsProps {
  truck: TruckType;
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

export default function TruckDetails({ truck }: TruckDetailsProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="p-4 bg-blue-100 rounded-xl">
          <Truck className="w-8 h-8 text-blue-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{truck.registration}</h2>
          <p className="text-gray-500">
            {truck.brand} {truck.model}
          </p>
        </div>
        <span
          className={`ml-auto px-3 py-1 text-sm font-medium rounded-full ${statusColors[truck.status]}`}
        >
          {statusLabels[truck.status]}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
          <Calendar className="w-5 h-5 text-gray-400" />
          <div>
            <p className="text-sm text-gray-500">Year</p>
            <p className="font-semibold">{truck.year}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
          <Fuel className="w-5 h-5 text-gray-400" />
          <div>
            <p className="text-sm text-gray-500">Fuel Capacity</p>
            <p className="font-semibold">{truck.fuelCapacity} L</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
          <Gauge className="w-5 h-5 text-gray-400" />
          <div>
            <p className="text-sm text-gray-500">Current Odometer</p>
            <p className="font-semibold">{truck.currentKm.toLocaleString()} km</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
          <MapPin className="w-5 h-5 text-gray-400" />
          <div>
            <p className="text-sm text-gray-500">Last Updated</p>
            <p className="font-semibold">
              {new Date(truck.updatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-500 mb-2">Additional Information</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Created:</span>
            <span className="ml-2">{new Date(truck.createdAt).toLocaleString()}</span>
          </div>
          <div>
            <span className="text-gray-500">Updated:</span>
            <span className="ml-2">{new Date(truck.updatedAt).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
