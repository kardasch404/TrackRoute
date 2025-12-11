import { TripService } from '../../../src/modules/trips/services/trip.service';
import { ITripRepository } from '../../../src/modules/trips/repositories/trip.repository';
import { ValidationException } from '../../../src/shared/exceptions/validation.exception';
import { NotFoundException } from '../../../src/shared/exceptions/not-found.exception';
import { ForbiddenException } from '../../../src/shared/exceptions/forbidden.exception';
import { TripStatus, TruckStatus, TrailerStatus, TireStatus } from '../../../src/shared/constants/status.constant';
import { UserRole } from '../../../src/shared/constants/roles.constant';
import { UserModel } from '../../../src/database/models/user.model';
import { TruckModel } from '../../../src/database/models/truck.model';
import { TrailerModel } from '../../../src/database/models/trailer.model';
import { TireModel } from '../../../src/database/models/tire.model';
import { MaintenanceModel } from '../../../src/database/models/maintenance.model';
import { TripModel } from '../../../src/database/models/trip.model';

jest.mock('../../../src/database/models/user.model');
jest.mock('../../../src/database/models/truck.model');
jest.mock('../../../src/database/models/trailer.model');
jest.mock('../../../src/database/models/tire.model');
jest.mock('../../../src/database/models/maintenance.model');
jest.mock('../../../src/database/models/trip.model');

describe('TripService', () => {
  let tripService: TripService;
  let tripRepository: jest.Mocked<ITripRepository>;

  const mockAdminUser = {
    _id: 'admin123',
    email: 'admin@test.com',
    role: UserRole.ADMIN,
    isActive: true,
  };

  const mockDriverUser = {
    _id: 'driver123',
    email: 'driver@test.com',
    role: UserRole.DRIVER,
    isActive: true,
  };

  const mockTruck = {
    _id: 'truck123',
    registration: 'TRK-001',
    status: TruckStatus.AVAILABLE,
    currentKm: 100000,
    maintenanceFrequencyKm: 10000,
  };

  const mockTrailer = {
    _id: 'trailer123',
    registration: 'TRL-001',
    status: TrailerStatus.AVAILABLE,
    currentKm: 50000,
    maintenanceFrequencyKm: 8000,
  };

  const mockTire = {
    _id: 'tire123',
    serialNumber: 'TIRE-001',
    position: 'FRONT_LEFT',
    status: TireStatus.GOOD,
    installKm: 90000,
    currentKm: 100000,
    maxLifeKm: 40000,
  };

  beforeEach(() => {
    tripRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByCode: jest.fn(),
      findAll: jest.fn(),
      findByDriver: jest.fn(),
      findByStatus: jest.fn(),
      findByTruck: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any;

    tripService = new TripService(tripRepository);

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('createTrip', () => {
    const createTripData = {
      code: 'TRIP-001',
      driver: 'driver123',
      truck: 'truck123',
      trailer: 'trailer123',
      origin: 'City A',
      destination: 'City B',
      distance: 500,
      startKm: 100000,
    };

    it('should create trip successfully with valid data', async () => {
      const mockCreatedTrip = {
        _id: 'trip123',
        ...createTripData,
        status: TripStatus.PLANNED,
      };

      // Mock repository and model methods
      tripRepository.findByCode.mockResolvedValue(null);
      (UserModel.findById as jest.Mock).mockImplementation((id) => {
        if (id === 'admin123') return Promise.resolve(mockAdminUser);
        if (id === 'driver123') return Promise.resolve(mockDriverUser);
        return Promise.resolve(null);
      });

      (TripModel.find as jest.Mock).mockResolvedValue([]);
      (TruckModel.findById as jest.Mock).mockResolvedValue(mockTruck);
      (TruckModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockTruck);
      (MaintenanceModel.findOne as jest.Mock).mockReturnValue({
        sort: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue(null),
        }),
      });
      (TireModel.find as jest.Mock).mockResolvedValue([
        { ...mockTire, currentKm: 100000, installKm: 90000, maxLifeKm: 40000 },
      ]);

      (TrailerModel.findById as jest.Mock).mockResolvedValue(mockTrailer);
      (TrailerModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockTrailer);

      tripRepository.create.mockResolvedValue(mockCreatedTrip as any);

      const result = await tripService.createTrip(createTripData, 'admin123');

      expect(tripRepository.findByCode).toHaveBeenCalledWith('TRIP-001');
      expect(UserModel.findById).toHaveBeenCalledWith('admin123');
      expect(result).toEqual(mockCreatedTrip);
    });

    it('should throw ValidationException if trip code already exists', async () => {
      tripRepository.findByCode.mockResolvedValue({ code: 'TRIP-001' } as any);

      await expect(tripService.createTrip(createTripData, 'admin123')).rejects.toThrow(
        ValidationException
      );
      await expect(tripService.createTrip(createTripData, 'admin123')).rejects.toThrow(
        'Trip with this code already exists'
      );
    });

    it('should throw ForbiddenException if user is not admin', async () => {
      tripRepository.findByCode.mockResolvedValue(null);
      (UserModel.findById as jest.Mock).mockResolvedValue(mockDriverUser);

      await expect(tripService.createTrip(createTripData, 'driver123')).rejects.toThrow(
        ForbiddenException
      );
      await expect(tripService.createTrip(createTripData, 'driver123')).rejects.toThrow(
        'Only ADMIN can assign trips'
      );
    });

    it('should throw NotFoundException if driver not found', async () => {
      tripRepository.findByCode.mockResolvedValue(null);
      (UserModel.findById as jest.Mock).mockImplementation((id) => {
        if (id === 'admin123') return Promise.resolve(mockAdminUser);
        return Promise.resolve(null);
      });

      await expect(tripService.createTrip(createTripData, 'admin123')).rejects.toThrow(
        NotFoundException
      );
      await expect(tripService.createTrip(createTripData, 'admin123')).rejects.toThrow(
        'Driver not found'
      );
    });

    it('should throw ValidationException if driver is not active', async () => {
      tripRepository.findByCode.mockResolvedValue(null);
      (UserModel.findById as jest.Mock).mockImplementation((id) => {
        if (id === 'admin123') return Promise.resolve(mockAdminUser);
        if (id === 'driver123')
          return Promise.resolve({ ...mockDriverUser, isActive: false });
        return Promise.resolve(null);
      });

      await expect(tripService.createTrip(createTripData, 'admin123')).rejects.toThrow(
        ValidationException
      );
      await expect(tripService.createTrip(createTripData, 'admin123')).rejects.toThrow(
        'Driver is not active'
      );
    });

    it('should throw ValidationException if driver has active trip', async () => {
      tripRepository.findByCode.mockResolvedValue(null);
      (UserModel.findById as jest.Mock).mockImplementation((id) => {
        if (id === 'admin123') return Promise.resolve(mockAdminUser);
        if (id === 'driver123') return Promise.resolve(mockDriverUser);
        return Promise.resolve(null);
      });

      (TripModel.find as jest.Mock).mockResolvedValue([{ status: TripStatus.IN_PROGRESS }] as any);

      await expect(tripService.createTrip(createTripData, 'admin123')).rejects.toThrow(
        ValidationException
      );
      await expect(tripService.createTrip(createTripData, 'admin123')).rejects.toThrow(
        'Driver already has an active trip'
      );
    });

    it('should throw ValidationException if truck status is not available', async () => {
      tripRepository.findByCode.mockResolvedValue(null);
      (UserModel.findById as jest.Mock).mockImplementation((id) => {
        if (id === 'admin123') return Promise.resolve(mockAdminUser);
        if (id === 'driver123') return Promise.resolve(mockDriverUser);
        return Promise.resolve(null);
      });

      (TripModel.find as jest.Mock).mockResolvedValue([]);
      (TruckModel.findById as jest.Mock).mockResolvedValue({
        ...mockTruck,
        status: TruckStatus.MAINTENANCE,
      });

      await expect(tripService.createTrip(createTripData, 'admin123')).rejects.toThrow(
        ValidationException
      );
      await expect(tripService.createTrip(createTripData, 'admin123')).rejects.toThrow(
        'Truck is not available'
      );
    });

    it('should throw ValidationException if truck has active trip', async () => {
      tripRepository.findByCode.mockResolvedValue(null);
      (UserModel.findById as jest.Mock).mockImplementation((id) => {
        if (id === 'admin123') return Promise.resolve(mockAdminUser);
        if (id === 'driver123') return Promise.resolve(mockDriverUser);
        return Promise.resolve(null);
      });

      (TripModel.find as jest.Mock).mockImplementation((query: any) => {
        if (query.driver) return Promise.resolve([]);
        if (query.truck) return Promise.resolve([{ status: TripStatus.PLANNED }]);
        return Promise.resolve([]);
      });
      (TruckModel.findById as jest.Mock).mockResolvedValue(mockTruck);

      await expect(tripService.createTrip(createTripData, 'admin123')).rejects.toThrow(
        ValidationException
      );
      await expect(tripService.createTrip(createTripData, 'admin123')).rejects.toThrow(
        'Truck already has an active trip'
      );
    });

    it('should throw ValidationException if truck needs maintenance soon', async () => {
      tripRepository.findByCode.mockResolvedValue(null);
      (UserModel.findById as jest.Mock).mockImplementation((id) => {
        if (id === 'admin123') return Promise.resolve(mockAdminUser);
        if (id === 'driver123') return Promise.resolve(mockDriverUser);
        return Promise.resolve(null);
      });

      (TripModel.find as jest.Mock).mockResolvedValue([]);
      (TruckModel.findById as jest.Mock).mockResolvedValue(mockTruck);
      (MaintenanceModel.findOne as jest.Mock).mockReturnValue({
        sort: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue({
            vehicleId: 'truck123',
            nextDueKm: 100400,
          }),
        }),
      });

      await expect(tripService.createTrip(createTripData, 'admin123')).rejects.toThrow(
        ValidationException
      );
      await expect(tripService.createTrip(createTripData, 'admin123')).rejects.toThrow(
        'Truck needs maintenance soon'
      );
    });

    it('should throw ValidationException if truck tire needs replacement', async () => {
      tripRepository.findByCode.mockResolvedValue(null);
      (UserModel.findById as jest.Mock).mockImplementation((id) => {
        if (id === 'admin123') return Promise.resolve(mockAdminUser);
        if (id === 'driver123') return Promise.resolve(mockDriverUser);
        return Promise.resolve(null);
      });

      (TripModel.find as jest.Mock).mockResolvedValue([]);
      (TruckModel.findById as jest.Mock).mockResolvedValue(mockTruck);
      (MaintenanceModel.findOne as jest.Mock).mockReturnValue({
        sort: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue(null),
        }),
      });
      (TireModel.find as jest.Mock).mockResolvedValue([
        { ...mockTire, position: 'FRONT_LEFT', status: TireStatus.NEEDS_REPLACEMENT },
      ]);

      await expect(tripService.createTrip(createTripData, 'admin123')).rejects.toThrow(
        ValidationException
      );
      await expect(tripService.createTrip(createTripData, 'admin123')).rejects.toThrow(
        'tire at position'
      );
    });

    it('should throw ValidationException if tire has insufficient remaining km', async () => {
      tripRepository.findByCode.mockResolvedValue(null);
      (UserModel.findById as jest.Mock).mockImplementation((id) => {
        if (id === 'admin123') return Promise.resolve(mockAdminUser);
        if (id === 'driver123') return Promise.resolve(mockDriverUser);
        return Promise.resolve(null);
      });

      (TripModel.find as jest.Mock).mockResolvedValue([]);
      (TruckModel.findById as jest.Mock).mockResolvedValue(mockTruck);
      (MaintenanceModel.findOne as jest.Mock).mockReturnValue({
        sort: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue(null),
        }),
      });
      // Tire with only 500km remaining (installKm: 90000 + maxLifeKm: 40000 - currentKm: 129500 = 500km)
      (TireModel.find as jest.Mock).mockResolvedValue([
        { ...mockTire, position: 'FRONT_LEFT', currentKm: 129500, installKm: 90000, maxLifeKm: 40000 },
      ]);

      await expect(tripService.createTrip(createTripData, 'admin123')).rejects.toThrow(
        ValidationException
      );
      await expect(tripService.createTrip(createTripData, 'admin123')).rejects.toThrow(
        'has only 500km remaining'
      );
    });

    it('should throw ValidationException if trip distance exceeds truck maintenance range', async () => {
      const longDistanceTrip = { ...createTripData, distance: 15000 };

      tripRepository.findByCode.mockResolvedValue(null);
      (UserModel.findById as jest.Mock).mockImplementation((id) => {
        if (id === 'admin123') return Promise.resolve(mockAdminUser);
        if (id === 'driver123') return Promise.resolve(mockDriverUser);
        return Promise.resolve(null);
      });

      (TripModel.find as jest.Mock).mockResolvedValue([]);
      (TruckModel.findById as jest.Mock).mockResolvedValue(mockTruck);
      (MaintenanceModel.findOne as jest.Mock).mockReturnValue({
        sort: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue({
            vehicleId: 'truck123',
            nextDueKm: 105000,
          }),
        }),
      });
      (TireModel.find as jest.Mock).mockResolvedValue([
        { ...mockTire, position: 'FRONT_LEFT', currentKm: 100000, installKm: 90000, maxLifeKm: 50000 },
      ]);

      await expect(tripService.createTrip(longDistanceTrip, 'admin123')).rejects.toThrow(
        ValidationException
      );
      await expect(tripService.createTrip(longDistanceTrip, 'admin123')).rejects.toThrow(
        "Trip distance (15000km) exceeds truck's remaining km before maintenance"
      );
    });

    it('should throw ValidationException if trailer status is not active', async () => {
      tripRepository.findByCode.mockResolvedValue(null);
      (UserModel.findById as jest.Mock).mockImplementation((id) => {
        if (id === 'admin123') return Promise.resolve(mockAdminUser);
        if (id === 'driver123') return Promise.resolve(mockDriverUser);
        return Promise.resolve(null);
      });

      (TripModel.find as jest.Mock).mockResolvedValue([]);
      (TruckModel.findById as jest.Mock).mockResolvedValue(mockTruck);
      (MaintenanceModel.findOne as jest.Mock).mockReturnValue({
        sort: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue(null),
        }),
      });
      (TireModel.find as jest.Mock).mockResolvedValue([
        { ...mockTire, currentKm: 100000, installKm: 90000, maxLifeKm: 40000 },
      ]);

      (TrailerModel.findById as jest.Mock).mockResolvedValue({
        ...mockTrailer,
        status: TrailerStatus.MAINTENANCE,
      });

      await expect(tripService.createTrip(createTripData, 'admin123')).rejects.toThrow(
        ValidationException
      );
      await expect(tripService.createTrip(createTripData, 'admin123')).rejects.toThrow(
        'Trailer is not available'
      );
    });
  });

  describe('updateStatus', () => {
    it('should update trip status successfully', async () => {
      const mockTrip = {
        _id: 'trip123',
        code: 'TRIP-001',
        driver: 'driver123',
        status: TripStatus.PLANNED,
      };

      const updatedTrip = { ...mockTrip, status: TripStatus.IN_PROGRESS };

      tripRepository.findById.mockResolvedValue(mockTrip as any);
      tripRepository.update.mockResolvedValue(updatedTrip as any);
      (UserModel.findById as jest.Mock).mockResolvedValue(mockDriverUser);

      const result = await tripService.updateStatus('trip123', TripStatus.IN_PROGRESS, 'driver123');

      expect(tripRepository.update).toHaveBeenCalledWith('trip123', { status: TripStatus.IN_PROGRESS, startedAt: expect.any(Date) });
      expect(result).toEqual(updatedTrip);
    });

    it('should throw NotFoundException if trip not found', async () => {
      tripRepository.findById.mockResolvedValue(null);

      await expect(
        tripService.updateStatus('trip123', TripStatus.IN_PROGRESS, 'driver123')
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if driver tries to update another driver trip', async () => {
      const mockTrip = {
        _id: 'trip123',
        driver: 'otherDriver',
        status: TripStatus.PLANNED,
      };

      tripRepository.findById.mockResolvedValue(mockTrip as any);
      (UserModel.findById as jest.Mock).mockResolvedValue(mockDriverUser);

      await expect(
        tripService.updateStatus('trip123', TripStatus.IN_PROGRESS, 'driver123')
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('getTripsByDriver', () => {
    it('should return trips for a specific driver', async () => {
      const mockTrips = [
        { _id: 'trip1', driver: 'driver123', status: TripStatus.COMPLETED },
        { _id: 'trip2', driver: 'driver123', status: TripStatus.IN_PROGRESS },
      ];

      tripRepository.findByDriver.mockResolvedValue(mockTrips as any);

      const result = await tripService.getTripsByDriver('driver123');

      expect(tripRepository.findByDriver).toHaveBeenCalledWith('driver123');
      expect(result).toEqual(mockTrips);
    });
  });

  describe('calculateTripCost', () => {
    it('should calculate trip cost with fuel consumption', async () => {
      const mockTrip = {
        _id: 'trip123',
        distance: 500,
        status: TripStatus.COMPLETED,
        actualStartTime: new Date('2025-12-01T08:00:00'),
        actualEndTime: new Date('2025-12-01T16:00:00'),
      };

      tripRepository.findById.mockResolvedValue(mockTrip as any);

      const mockTripWithFuel = {
        ...mockTrip,
        fuelConsumed: 20,
      };
      
      tripRepository.findById.mockResolvedValue(mockTripWithFuel as any);

      const result = await tripService.calculateTripCost('trip123', 1.5);

      expect(result).toBe(30); // 20 liters * 1.5 per liter
    });

    it('should throw NotFoundException if trip not found', async () => {
      tripRepository.findById.mockResolvedValue(null);

      await expect(tripService.calculateTripCost('trip123', 1.5)).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('getAllTrips', () => {
    it('should return all trips', async () => {
      const mockTrips = [
        { _id: 'trip1', code: 'TRIP-001' },
        { _id: 'trip2', code: 'TRIP-002' },
      ];

      tripRepository.findAll.mockResolvedValue(mockTrips as any);

      const result = await tripService.getAllTrips();

      expect(tripRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockTrips);
    });
  });

  describe('getTripById', () => {
    it('should return trip by id', async () => {
      const mockTrip = { _id: 'trip123', code: 'TRIP-001' };

      tripRepository.findById.mockResolvedValue(mockTrip as any);

      const result = await tripService.getTripById('trip123');

      expect(tripRepository.findById).toHaveBeenCalledWith('trip123');
      expect(result).toEqual(mockTrip);
    });

    it('should throw NotFoundException if trip not found', async () => {
      tripRepository.findById.mockResolvedValue(null);

      await expect(tripService.getTripById('trip123')).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteTrip', () => {
    it('should delete trip successfully', async () => {
      const mockTrip = { _id: 'trip123', code: 'TRIP-001' };

      tripRepository.delete.mockResolvedValue(mockTrip as any);

      const result = await tripService.deleteTrip('trip123');

      expect(tripRepository.delete).toHaveBeenCalledWith('trip123');
      expect(result).toEqual(mockTrip);
    });

    it('should throw NotFoundException if trip not found', async () => {
      tripRepository.delete.mockResolvedValue(null);

      await expect(tripService.deleteTrip('trip123')).rejects.toThrow(NotFoundException);
    });
  });
});
