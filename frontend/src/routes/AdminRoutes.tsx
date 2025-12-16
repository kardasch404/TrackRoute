import { Route } from 'react-router-dom';
import AdminLayout from '../components/layout/AdminLayout';
import RoleBasedRoute from '../components/layout/RoleBasedRoute';
import TrucksPage from '../pages/admin/TrucksPage';
import DriversPage from '../pages/admin/DriversPage';
import TripsPage from '../pages/admin/TripsPage';

export default function AdminRoutes() {
  return (
    <Route
      path="/admin"
      element={
        <RoleBasedRoute allowedRoles={['ADMIN']}>
          <AdminLayout />
        </RoleBasedRoute>
      }
    >
      <Route path="dashboard" element={<div>Admin Dashboard</div>} />
      <Route path="trucks" element={<TrucksPage />} />
      <Route path="trailers" element={<div>Trailers</div>} />
      <Route path="trips" element={<TripsPage />} />
      <Route path="drivers" element={<DriversPage />} />
      <Route path="maintenance" element={<div>Maintenance</div>} />
      <Route path="reports" element={<div>Reports</div>} />
    </Route>
  );
}
