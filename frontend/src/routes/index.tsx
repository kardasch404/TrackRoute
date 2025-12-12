import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import RootLayout from '../components/layout/RootLayout';
import PublicRoute from '../components/layout/PublicRoute';
import ProtectedRoute from '../components/layout/ProtectedRoute';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import AdminLayout from '../components/layout/AdminLayout';
import DriverLayout from '../components/layout/DriverLayout';
import RoleBasedRoute from '../components/layout/RoleBasedRoute';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <PublicRoute><LoginPage /></PublicRoute>,
      },
      {
        path: 'login',
        element: <PublicRoute><LoginPage /></PublicRoute>,
      },
      {
        path: 'register',
        element: <PublicRoute><RegisterPage /></PublicRoute>,
      },
      {
        path: 'admin',
        element: (
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['ADMIN']}>
              <AdminLayout />
            </RoleBasedRoute>
          </ProtectedRoute>
        ),
        children: [
          { path: 'dashboard', element: <div>Admin Dashboard</div> },
          { path: 'trucks', element: <div>Trucks</div> },
          { path: 'trailers', element: <div>Trailers</div> },
          { path: 'trips', element: <div>Trips</div> },
          { path: 'drivers', element: <div>Drivers</div> },
          { path: 'maintenance', element: <div>Maintenance</div> },
          { path: 'reports', element: <div>Reports</div> },
        ],
      },
      {
        path: 'driver',
        element: (
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['DRIVER']}>
              <DriverLayout />
            </RoleBasedRoute>
          </ProtectedRoute>
        ),
        children: [
          { path: 'my-trips', element: <div>My Trips</div> },
          { path: 'trip/:id', element: <div>Trip Details</div> },
        ],
      },
      {
        path: 'unauthorized',
        element: <div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl">Unauthorized Access</h1></div>,
      },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
