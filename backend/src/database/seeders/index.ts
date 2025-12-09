import { seedPermissions } from './permissions.seeder';
import { seedRoles } from './roles.seeder';
import { connectDatabase } from '../../config/database.config';

export const runSeeders = async () => {
  try {
    await connectDatabase();
    await seedPermissions();
    await seedRoles();
    console.log('All seeders completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seeder error:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  runSeeders();
}
