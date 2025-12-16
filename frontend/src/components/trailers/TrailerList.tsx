import type { Trailer } from '../../features/trailers/trailersTypes';
import TrailerCard from './TrailerCard';
import Spinner from '../common/Spinner';

interface TrailerListProps {
  trailers: Trailer[];
  isLoading: boolean;
  onView: (trailer: Trailer) => void;
  onEdit: (trailer: Trailer) => void;
  onDelete: (trailer: Trailer) => void;
}

export default function TrailerList({
  trailers,
  isLoading,
  onView,
  onEdit,
  onDelete,
}: TrailerListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (trailers.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No trailers found</p>
        <p className="text-gray-400 text-sm mt-1">
          Try adjusting your filters or add a new trailer
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {trailers.map((trailer) => (
        <TrailerCard
          key={trailer._id}
          trailer={trailer}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
