export enum Permission {
  // Dashboard permissions
  DASHBOARD_READ = 'dashboard:read',

  // User permissions
  USER_CREATE = 'user:create',
  USER_READ = 'user:read',
  USER_UPDATE = 'user:update',
  USER_DELETE = 'user:delete',

  // Truck permissions
  TRUCK_CREATE = 'truck:create',
  TRUCK_READ = 'truck:read',
  TRUCK_UPDATE = 'truck:update',
  TRUCK_DELETE = 'truck:delete',

  // Trailer permissions
  TRAILER_CREATE = 'trailer:create',
  TRAILER_READ = 'trailer:read',
  TRAILER_UPDATE = 'trailer:update',
  TRAILER_DELETE = 'trailer:delete',

  // Trip permissions
  TRIP_CREATE = 'trip:create',
  TRIP_READ = 'trip:read',
  TRIP_UPDATE = 'trip:update',
  TRIP_DELETE = 'trip:delete',

  // Fuel permissions
  FUEL_CREATE = 'fuel:create',
  FUEL_READ = 'fuel:read',
  FUEL_UPDATE = 'fuel:update',
  FUEL_DELETE = 'fuel:delete',

  // Maintenance permissions
  MAINTENANCE_CREATE = 'maintenance:create',
  MAINTENANCE_READ = 'maintenance:read',
  MAINTENANCE_UPDATE = 'maintenance:update',
  MAINTENANCE_DELETE = 'maintenance:delete',

  // Tire permissions
  TIRE_CREATE = 'tire:create',
  TIRE_READ = 'tire:read',
  TIRE_UPDATE = 'tire:update',
  TIRE_DELETE = 'tire:delete',

  // Report permissions
  REPORT_VIEW = 'report:view',
  REPORT_EXPORT = 'report:export',
}
