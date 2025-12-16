import { Route } from 'react-router-dom';
import DriverLayout from '../components/layout/DriverLayout';
import RoleBasedRoute from '../components/layout/RoleBasedRoute';
import MyTripsPage from '../pages/driver/MyTripsPage';

export default function DriverRoutes() {
  return (
    <Route
      path="/driver"
      element={
        <RoleBasedRoute allowedRoles={['DRIVER']}>
          <DriverLayout />
        </RoleBasedRoute>
      }
    >
      <Route path="my-trips" element={<MyTripsPage />} />
      <Route path="trip/:id" element={<div>Trip Details</div>} />
    </Route>
  );
}
