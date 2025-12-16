import { Search, Filter } from 'lucide-react';
import type { TruckStatus } from '../../features/trucks/trucksTypes';

interface TruckFiltersProps {
  status: TruckStatus | '';
  search: string;
  onStatusChange: (status: TruckStatus | '') => void;
  onSearchChange: (search: string) => void;
}

const statusOptions: { value: TruckStatus | ''; label: string }[] = [
  { value: '', label: 'All Status' },
  { value: 'AVAILABLE', label: 'Available' },
  { value: 'IN_USE', label: 'In Use' },
  { value: 'MAINTENANCE', label: 'Maintenance' },
  { value: 'OUT_OF_SERVICE', label: 'Out of Service' },
];

export default function TruckFilters({
  status,
  search,
  onStatusChange,
  onSearchChange,
}: TruckFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by registration, brand, or model..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        />
      </div>
      <div className="relative">
        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value as TruckStatus | '')}
          className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white min-w-[180px]"
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
