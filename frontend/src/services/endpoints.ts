export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  ME: '/auth/me',
};

export const TRIP_ENDPOINTS = {
  LIST: '/trips',
  CREATE: '/trips',
  BY_ID: (id: string) => `/trips/${id}`,
  UPDATE_STATUS: (id: string) => `/trips/${id}/status`,
};

export const TRUCK_ENDPOINTS = {
  LIST: '/trucks',
  CREATE: '/trucks',
  BY_ID: (id: string) => `/trucks/${id}`,
};

export const TRAILER_ENDPOINTS = {
  LIST: '/trailers',
  CREATE: '/trailers',
  BY_ID: (id: string) => `/trailers/${id}`,
};

export const MAINTENANCE_ENDPOINTS = {
  LIST: '/maintenance',
  CREATE: '/maintenance',
  BY_VEHICLE: (vehicleId: string) => `/maintenance/vehicle/${vehicleId}`,
};
