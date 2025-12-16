import Card from '../common/Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { useTripStats } from '../../hooks/useDashboardStats';

export default function FuelConsumptionChart() {
  const { data: stats, isLoading, error } = useTripStats(6);

  if (isLoading) {
    return (
      <Card>
        <h3 className="text-lg font-semibold mb-4">Trip & Fuel Statistics</h3>
        <div className="h-[300px] flex items-center justify-center">
          <div className="animate-pulse w-full h-full bg-gray-200 rounded"></div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <h3 className="text-lg font-semibold mb-4">Trip & Fuel Statistics</h3>
        <div className="h-[300px] flex items-center justify-center text-red-500">
          Failed to load statistics
        </div>
      </Card>
    );
  }

  // If no data, show placeholder
  if (!stats || stats.length === 0) {
    return (
      <Card>
        <h3 className="text-lg font-semibold mb-4">Trip & Fuel Statistics</h3>
        <div className="h-[300px] flex flex-col items-center justify-center text-gray-500">
          <svg className="w-16 h-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p>No trip data available yet</p>
          <p className="text-sm">Complete some trips to see statistics</p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <h3 className="text-lg font-semibold mb-4">Trip & Fuel Statistics (Last 6 Months)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={stats}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis yAxisId="left" orientation="left" stroke="#3b82f6" />
          <YAxis yAxisId="right" orientation="right" stroke="#10b981" />
          <Tooltip 
            contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
          />
          <Legend />
          <Bar yAxisId="left" dataKey="tripCount" name="Trips" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          <Bar yAxisId="right" dataKey="fuelConsumed" name="Fuel (L)" fill="#10b981" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
