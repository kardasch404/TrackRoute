import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { UserModel } from '../src/database/models/user.model';
import { UserRole } from '../src/shared/constants/roles.constant';

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27018/trackroute');

    const existingAdmin = await UserModel.findOne({ email: 'kardasch@trackroute.ma' });
    
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash('trackroute', 10);

    await UserModel.create({
      email: 'kardasch@trackroute.ma',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'TrackRoute',
      role: UserRole.ADMIN,
      isActive: true,
    });

    console.log('Admin user created successfully!');
    console.log('Email: kardasch@trackroute.ma');
    console.log('Password: trackroute');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();
