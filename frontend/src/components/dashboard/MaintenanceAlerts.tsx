import { useNavigate } from 'react-router-dom';
import Card from '../common/Card';
import Alert from '../common/Alert';
import { useMaintenanceAlerts } from '../../hooks/useDashboardStats';

export default function MaintenanceAlerts() {
  const { data: alerts, isLoading, error } = useMaintenanceAlerts(5);
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <Card>
        <h3 className="text-lg font-semibold mb-4">Maintenance Alerts</h3>
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-gray-200 rounded"></div>
          ))}
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <h3 className="text-lg font-semibold mb-4">Maintenance Alerts</h3>
        <p className="text-red-500 text-sm">Failed to load alerts</p>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Maintenance Alerts</h3>
        {alerts && alerts.length > 0 && (
          <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {alerts.length} active
          </span>
        )}
      </div>
      
      {alerts && alerts.length > 0 ? (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <Alert 
              key={alert.id} 
              variant={alert.severity === 'danger' ? 'danger' : 'warning'}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{alert.message}</p>
                  <p className="text-sm opacity-75 mt-1">Vehicle: {alert.vehicle}</p>
                </div>
                <span className="text-xs uppercase bg-white/20 px-2 py-1 rounded">
                  {alert.type}
                </span>
              </div>
            </Alert>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-green-500 mb-2">
            <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-500">No maintenance alerts</p>
          <p className="text-sm text-gray-400">All vehicles are in good condition</p>
        </div>
      )}
    </Card>
  );
}
