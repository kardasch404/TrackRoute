import { PermissionModel } from '../models/permission.model';
import { Permission } from '../../shared/constants/permissions.constant';

export const seedPermissions = async () => {
  const permissions = Object.values(Permission).map((key) => ({
    key,
    description: key.replace(/:/g, ' ').replace(/_/g, ' '),
  }));

  await PermissionModel.deleteMany({});
  await PermissionModel.insertMany(permissions);
  console.log('Permissions seeded successfully');
};
