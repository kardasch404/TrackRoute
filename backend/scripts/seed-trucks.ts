import mongoose from 'mongoose';
import { TruckModel } from '../src/database/models/truck.model';
import { TruckStatus } from '../src/shared/constants/status.constant';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27018/trackroute';

const trucks = [
  {
    registration: 'TRK-001-MA',
    brand: 'Volvo',
    model: 'FH16',
    year: 2022,
    fuelCapacity: 400,
    currentKm: 125000,
    status: TruckStatus.AVAILABLE,
  },
  {
    registration: 'TRK-002-MA',
    brand: 'Mercedes-Benz',
    model: 'Actros',
    year: 2021,
    fuelCapacity: 450,
    currentKm: 180000,
    status: TruckStatus.IN_USE,
  },
  {
    registration: 'TRK-003-MA',
    brand: 'Scania',
    model: 'R500',
    year: 2023,
    fuelCapacity: 380,
    currentKm: 45000,
    status: TruckStatus.AVAILABLE,
  },
  {
    registration: 'TRK-004-MA',
    brand: 'MAN',
    model: 'TGX',
    year: 2020,
    fuelCapacity: 420,
    currentKm: 220000,
    status: TruckStatus.MAINTENANCE,
  },
  {
    registration: 'TRK-005-MA',
    brand: 'DAF',
    model: 'XF',
    year: 2022,
    fuelCapacity: 390,
    currentKm: 95000,
    status: TruckStatus.IN_USE,
  },
  {
    registration: 'TRK-006-MA',
    brand: 'Iveco',
    model: 'S-Way',
    year: 2021,
    fuelCapacity: 400,
    currentKm: 150000,
    status: TruckStatus.AVAILABLE,
  },
  {
    registration: 'TRK-007-MA',
    brand: 'Renault',
    model: 'T High',
    year: 2023,
    fuelCapacity: 410,
    currentKm: 35000,
    status: TruckStatus.AVAILABLE,
  },
  {
    registration: 'TRK-008-MA',
    brand: 'Volvo',
    model: 'FM',
    year: 2019,
    fuelCapacity: 350,
    currentKm: 280000,
    status: TruckStatus.OUT_OF_SERVICE,
  },
  {
    registration: 'TRK-009-MA',
    brand: 'Mercedes-Benz',
    model: 'Arocs',
    year: 2022,
    fuelCapacity: 380,
    currentKm: 78000,
    status: TruckStatus.IN_USE,
  },
  {
    registration: 'TRK-010-MA',
    brand: 'Scania',
    model: 'S730',
    year: 2024,
    fuelCapacity: 500,
    currentKm: 12000,
    status: TruckStatus.AVAILABLE,
  },
];

async function seedTrucks() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Delete existing trucks
    await TruckModel.deleteMany({});
    console.log('Cleared existing trucks');

    // Set createdAt to December 13, 2025
    const createdAt = new Date('2025-12-13T10:00:00.000Z');

    // Insert trucks with custom timestamps
    const trucksWithDates = trucks.map((truck) => ({
      ...truck,
      createdAt,
      updatedAt: createdAt,
    }));

    const result = await TruckModel.insertMany(trucksWithDates);
    console.log(`✅ Successfully inserted ${result.length} trucks with date 13/12/2025`);

    // Display inserted trucks
    console.log('\nInserted trucks:');
    result.forEach((truck, index) => {
      console.log(`${index + 1}. ${truck.registration} - ${truck.brand} ${truck.model} (${truck.status})`);
    });

    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding trucks:', error);
    process.exit(1);
  }
}

seedTrucks();
