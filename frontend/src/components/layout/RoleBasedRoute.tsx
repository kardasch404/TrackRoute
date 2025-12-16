import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import { selectUser } from '../../features/auth/authSlice';

interface RoleBasedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export default function RoleBasedRoute({ children, allowedRoles }: RoleBasedRouteProps) {
  const user = useAppSelector(selectUser);
  
  if (!user) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/unauthorized" replace />;
  
  // Check driver status
  if (user.role === 'DRIVER') {
    if (user.status === 'PENDING') return <Navigate to="/pending-approval" replace />;
    if (user.status === 'REJECTED') return <Navigate to="/account-rejected" replace />;
  }
  
  return <>{children}</>;
}
