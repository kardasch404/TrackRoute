import Card from '../common/Card';
import Alert from '../common/Alert';

export default function MaintenanceAlerts() {
  const alerts = [
    { id: 1, message: 'Truck TRK-001 needs oil change', variant: 'warning' as const },
    { id: 2, message: 'Tire replacement required for TRL-003', variant: 'danger' as const },
  ];

  return (
    <Card>
      <h3 className="text-lg font-semibold mb-4">Maintenance Alerts</h3>
      <div className="space-y-3">
        {alerts.map((alert) => (
          <Alert key={alert.id} variant={alert.variant}>
            {alert.message}
          </Alert>
        ))}
      </div>
    </Card>
  );
}
