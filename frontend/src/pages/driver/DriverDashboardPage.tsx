import { useAppSelector } from '../../app/hooks';

// Simple SVG icons
const TruckIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 17h.01M8 12h.01M17 17h.01M5 6h14l1 8H4L5 6zM5 14h14v3a2 2 0 01-2 2H7a2 2 0 01-2-2v-3z" />
  </svg>
);

const MapIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
  </svg>
);

const ClockIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CheckCircleIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default function DriverDashboardPage() {
  const user = useAppSelector((state) => state.auth.user);

  const stats = [
    { name: 'Completed Trips', value: '0', icon: CheckCircleIcon, color: 'bg-green-500' },
    { name: 'Pending Trips', value: '0', icon: ClockIcon, color: 'bg-yellow-500' },
    { name: 'Total Distance', value: '0 km', icon: MapIcon, color: 'bg-blue-500' },
    { name: 'Assigned Truck', value: 'None', icon: TruckIcon, color: 'bg-purple-500' },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome, {user?.firstName}!
        </h1>
        <p className="text-gray-600">Here's an overview of your activity.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            <MapIcon className="h-5 w-5 mr-2" />
            View My Trips
          </button>
          <button className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
            <TruckIcon className="h-5 w-5 mr-2" />
            Start New Trip
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="text-center py-8 text-gray-500">
          <MapIcon className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <p>No recent trips to display.</p>
          <p className="text-sm">Your trip history will appear here.</p>
        </div>
      </div>
    </div>
  );
}
