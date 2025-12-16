export type DriverStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface Driver {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'DRIVER';
  status: DriverStatus;
  createdAt: string;
  updatedAt: string;
}

export interface DriverFilters {
  status?: DriverStatus | '';
  search?: string;
}
