import { Search } from 'lucide-react';
import type { TrailerStatus } from '../../features/trailers/trailersTypes';

interface TrailerFiltersProps {
  status: TrailerStatus | '';
  search: string;
  onStatusChange: (status: TrailerStatus | '') => void;
  onSearchChange: (search: string) => void;
}

const statusOptions: { value: TrailerStatus | ''; label: string }[] = [
  { value: '', label: 'All Status' },
  { value: 'AVAILABLE', label: 'Available' },
  { value: 'IN_USE', label: 'In Use' },
  { value: 'MAINTENANCE', label: 'Maintenance' },
  { value: 'OUT_OF_SERVICE', label: 'Out of Service' },
];

export default function TrailerFilters({
  status,
  search,
  onStatusChange,
  onSearchChange,
}: TrailerFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by registration or type..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
        />
      </div>

      {/* Status Filter */}
      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value as TrailerStatus | '')}
        className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition bg-white"
      >
        {statusOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
