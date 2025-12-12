import apiClient from './apiClient';
import { AUTH_ENDPOINTS } from './endpoints';
import type { LoginRequest, LoginResponse, RegisterRequest } from '../features/auth/authTypes';

export const authApi = {
  login: (data: LoginRequest) => apiClient.post<LoginResponse>(AUTH_ENDPOINTS.LOGIN, data),
  register: (data: RegisterRequest) => apiClient.post(AUTH_ENDPOINTS.REGISTER, data),
  getMe: () => apiClient.get(AUTH_ENDPOINTS.ME),
};

export default apiClient;
