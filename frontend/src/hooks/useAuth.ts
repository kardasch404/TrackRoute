import { useAppDispatch } from '../app/hooks';
import { loginSuccess, logout as logoutAction, setLoading } from '../features/auth/authSlice';
import { authApi } from '../services/api';
import { useNavigate } from 'react-router-dom';
import type { RegisterRequest } from '../features/auth/authTypes';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const login = async (credentials: { email: string; password: string }) => {
    try {
      dispatch(setLoading(true));
      const response = await authApi.login(credentials);
      const { user, accessToken } = response.data.data;
      dispatch(loginSuccess({ user: { ...user, _id: user.id || user._id }, token: accessToken }));
      
      // Check user status and role for navigation
      if (user.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else if (user.status === 'PENDING') {
        navigate('/pending-approval');
      } else if (user.status === 'REJECTED') {
        navigate('/account-rejected');
      } else {
        navigate('/driver/dashboard');
      }
    } catch (error) {
      dispatch(setLoading(false));
      throw error;
    }
  };

  const register = async (userData: Omit<RegisterRequest, 'confirmPassword'> & { confirmPassword?: string }) => {
    // Exclude confirmPassword from the request - it's only for frontend validation
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...registerData } = userData;
    const response = await authApi.register(registerData);
    return response.data;
  };

  const logout = () => {
    dispatch(logoutAction());
    navigate('/login');
  };

  return { login, register, logout };
};
