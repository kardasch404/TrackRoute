import Card from '../common/Card';
import Table from '../common/Table';
import Badge from '../common/Badge';

export default function RecentTrips() {
  const trips = [
    { code: 'TRIP-001', driver: 'John Doe', status: 'IN_PROGRESS', destination: 'City B' },
    { code: 'TRIP-002', driver: 'Jane Smith', status: 'COMPLETED', destination: 'City C' },
  ];

  return (
    <Card>
      <h3 className="text-lg font-semibold mb-4">Recent Trips</h3>
      <Table headers={['Code', 'Driver', 'Destination', 'Status']}>
        {trips.map((trip) => (
          <tr key={trip.code}>
            <td className="px-6 py-4">{trip.code}</td>
            <td className="px-6 py-4">{trip.driver}</td>
            <td className="px-6 py-4">{trip.destination}</td>
            <td className="px-6 py-4">
              <Badge variant={trip.status === 'COMPLETED' ? 'success' : 'info'}>{trip.status}</Badge>
            </td>
          </tr>
        ))}
      </Table>
    </Card>
  );
}
