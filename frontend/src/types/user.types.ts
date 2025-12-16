export type UserStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface User {
  _id: string;
  id?: string; // API returns id instead of _id sometimes
  email: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'DRIVER';
  status: UserStatus;
  isActive?: boolean;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}
