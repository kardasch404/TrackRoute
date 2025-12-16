import type { Truck } from '../../features/trucks/trucksTypes';
import TruckCard from './TruckCard';
import Spinner from '../common/Spinner';

interface TruckListProps {
  trucks: Truck[];
  isLoading: boolean;
  onView: (truck: Truck) => void;
  onEdit: (truck: Truck) => void;
  onDelete: (truck: Truck) => void;
}

export default function TruckList({
  trucks,
  isLoading,
  onView,
  onEdit,
  onDelete,
}: TruckListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (trucks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No trucks found</p>
        <p className="text-gray-400 text-sm mt-1">
          Try adjusting your filters or add a new truck
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {trucks.map((truck) => (
        <TruckCard
          key={truck._id}
          truck={truck}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
