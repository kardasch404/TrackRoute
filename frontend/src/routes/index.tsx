import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import RootLayout from '../components/layout/RootLayout';
import PublicRoute from '../components/layout/PublicRoute';
import ProtectedRoute from '../components/layout/ProtectedRoute';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import PendingApprovalPage from '../pages/auth/PendingApprovalPage';
import AccountRejectedPage from '../pages/auth/AccountRejectedPage';
import AdminLayout from '../components/layout/AdminLayout';
import DriverLayout from '../components/layout/DriverLayout';
import RoleBasedRoute from '../components/layout/RoleBasedRoute';
import DashboardPage from '../pages/admin/DashboardPage';
import TrucksPage from '../pages/admin/TrucksPage';
import TrailersPage from '../pages/admin/TrailersPage';
import DriversPage from '../pages/admin/DriversPage';
import DriverDashboardPage from '../pages/driver/DriverDashboardPage';

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
        path: 'pending-approval',
        element: <PendingApprovalPage />,
      },
      {
        path: 'account-rejected',
        element: <AccountRejectedPage />,
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
          { path: 'dashboard', element: <DashboardPage /> },
          { path: 'trucks', element: <TrucksPage /> },
          { path: 'trailers', element: <TrailersPage /> },
          { path: 'trips', element: <div>Trips</div> },
          { path: 'drivers', element: <DriversPage /> },
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
          { path: 'dashboard', element: <DriverDashboardPage /> },
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
