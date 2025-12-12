import Card from '../common/Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function FuelConsumptionChart() {
  const data = [
    { month: 'Jan', consumption: 400 },
    { month: 'Feb', consumption: 300 },
    { month: 'Mar', consumption: 500 },
    { month: 'Apr', consumption: 450 },
    { month: 'May', consumption: 600 },
  ];

  return (
    <Card>
      <h3 className="text-lg font-semibold mb-4">Fuel Consumption</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="consumption" stroke="#3b82f6" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
