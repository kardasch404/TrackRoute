import { RoleModel } from '../models/role.model';
import { PermissionModel } from '../models/permission.model';
import { UserRole } from '../../shared/constants/roles.constant';
import { Permission } from '../../shared/constants/permissions.constant';

export const seedRoles = async () => {
  const allPermissions = await PermissionModel.find();
  const permissionMap = new Map(allPermissions.map((p) => [p.key, p._id]));

  const adminPermissions = allPermissions.map((p) => p._id);
  
  const driverPermissions = [
    Permission.TRIP_READ,
    Permission.FUEL_CREATE,
    Permission.FUEL_READ,
    Permission.MAINTENANCE_READ,
    Permission.TIRE_READ,
  ].map((key) => permissionMap.get(key)!);

  await RoleModel.deleteMany({});
  await RoleModel.insertMany([
    { name: UserRole.ADMIN, permissions: adminPermissions },
    { name: UserRole.DRIVER, permissions: driverPermissions },
  ]);

  console.log('Roles seeded successfully');
};
