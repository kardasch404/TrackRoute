import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import { selectIsAuthenticated, selectUser } from '../../features/auth/authSlice';

export default function PublicRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);
  
  if (isAuthenticated && user) {
    return <Navigate to={user.role === 'ADMIN' ? '/admin/dashboard' : '/driver/my-trips'} replace />;
  }
  
  return <>{children}</>;
}
