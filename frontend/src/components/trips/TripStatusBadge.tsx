import type { TripStatus } from '../../features/trips/tripsTypes';

interface TripStatusBadgeProps {
  status: TripStatus;
  size?: 'sm' | 'md' | 'lg';
}

const statusConfig: Record<TripStatus, { bg: string; text: string; label: string }> = {
  PLANNED: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Planned' },
  IN_PROGRESS: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'In Progress' },
  COMPLETED: { bg: 'bg-green-100', text: 'text-green-800', label: 'Completed' },
  CANCELLED: { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelled' },
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base',
};

export default function TripStatusBadge({ status, size = 'md' }: TripStatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.PLANNED;
  
  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full ${config.bg} ${config.text} ${sizeClasses[size]}`}
    >
      {config.label}
    </span>
  );
}
