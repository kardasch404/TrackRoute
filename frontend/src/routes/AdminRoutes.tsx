import { Route } from 'react-router-dom';
import AdminLayout from '../components/layout/AdminLayout';
import RoleBasedRoute from '../components/layout/RoleBasedRoute';
import TrucksPage from '../pages/admin/TrucksPage';

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
      <Route path="trips" element={<div>Trips</div>} />
      <Route path="drivers" element={<div>Drivers</div>} />
      <Route path="maintenance" element={<div>Maintenance</div>} />
      <Route path="reports" element={<div>Reports</div>} />
    </Route>
  );
}
