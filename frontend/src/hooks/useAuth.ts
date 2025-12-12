import { useAppDispatch } from '../app/hooks';
import { loginSuccess, logout as logoutAction, setLoading } from '../features/auth/authSlice';
import { authApi } from '../services/api';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const login = async (credentials: { email: string; password: string }) => {
    try {
      dispatch(setLoading(true));
      const response = await authApi.login(credentials);
      dispatch(loginSuccess(response.data));
      navigate(response.data.user.role === 'ADMIN' ? '/admin/dashboard' : '/driver/my-trips');
    } catch (error: any) {
      dispatch(setLoading(false));
      throw error;
    }
  };

  const register = async (userData: any) => {
    const response = await authApi.register(userData);
    return response.data;
  };

  const logout = () => {
    dispatch(logoutAction());
    navigate('/login');
  };

  return { login, register, logout };
};
