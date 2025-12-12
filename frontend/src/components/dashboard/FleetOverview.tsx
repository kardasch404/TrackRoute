import Card from '../common/Card';
import Badge from '../common/Badge';

export default function FleetOverview() {
  const fleetData = [
    { status: 'Available', count: 12, variant: 'success' as const },
    { status: 'In Use', count: 8, variant: 'info' as const },
    { status: 'Maintenance', count: 3, variant: 'warning' as const },
  ];

  return (
    <Card>
      <h3 className="text-lg font-semibold mb-4">Fleet Overview</h3>
      <div className="space-y-3">
        {fleetData.map((item) => (
          <div key={item.status} className="flex justify-between items-center">
            <span className="text-gray-700">{item.status}</span>
            <Badge variant={item.variant}>{item.count}</Badge>
          </div>
        ))}
      </div>
    </Card>
  );
}
