import { TruckService } from '../../../src/modules/trucks/services/truck.service';
import { ITruckRepository } from '../../../src/modules/trucks/repositories/truck.repository';
import { ValidationException } from '../../../src/shared/exceptions/validation.exception';
import { NotFoundException } from '../../../src/shared/exceptions/not-found.exception';
import { TruckStatus } from '../../../src/shared/constants/status.constant';

describe('TruckService', () => {
  let truckService: TruckService;
  let truckRepository: jest.Mocked<ITruckRepository>;

  beforeEach(() => {
    truckRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByRegistration: jest.fn(),
      findByStatus: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findWithPagination: jest.fn(),
      searchByRegistration: jest.fn(),
    } as any;

    truckService = new TruckService(truckRepository);
  });

  describe('createTruck', () => {
    it('should create truck successfully', async () => {
      const truckData = {
        registration: 'ABC123',
        brand: 'Volvo',
        model: 'FH16',
        year: 2023,
        fuelCapacity: 500,
      };

      const mockTruck = { _id: '1', ...truckData, currentKm: 0, status: TruckStatus.AVAILABLE };

      truckRepository.findByRegistration.mockResolvedValue(null);
      truckRepository.create.mockResolvedValue(mockTruck as any);

      const result = await truckService.createTruck(truckData);

      expect(truckRepository.findByRegistration).toHaveBeenCalledWith('ABC123');
      expect(truckRepository.create).toHaveBeenCalledWith(truckData);
      expect(result).toEqual(mockTruck);
    });

    it('should throw ValidationException if registration exists', async () => {
      const truckData = { registration: 'ABC123', brand: 'Volvo', model: 'FH16', year: 2023, fuelCapacity: 500 };

      truckRepository.findByRegistration.mockResolvedValue({} as any);

      await expect(truckService.createTruck(truckData)).rejects.toThrow(ValidationException);
      expect(truckRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('getTruckById', () => {
    it('should return truck by id', async () => {
      const mockTruck = { _id: '1', registration: 'ABC123' };
      truckRepository.findById.mockResolvedValue(mockTruck as any);

      const result = await truckService.getTruckById('1');

      expect(result).toEqual(mockTruck);
    });

    it('should throw NotFoundException if truck not found', async () => {
      truckRepository.findById.mockResolvedValue(null);

      await expect(truckService.getTruckById('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateTruck', () => {
    it('should update truck successfully', async () => {
      const updateData = { brand: 'Scania' };
      const mockTruck = { _id: '1', registration: 'ABC123', brand: 'Scania' };

      truckRepository.update.mockResolvedValue(mockTruck as any);

      const result = await truckService.updateTruck('1', updateData);

      expect(result).toEqual(mockTruck);
    });

    it('should throw ValidationException if new registration exists', async () => {
      const updateData = { registration: 'XYZ789' };
      const existingTruck = { _id: '2', registration: 'XYZ789' };

      truckRepository.findByRegistration.mockResolvedValue(existingTruck as any);

      await expect(truckService.updateTruck('1', updateData)).rejects.toThrow(ValidationException);
    });

    it('should throw NotFoundException if truck not found', async () => {
      truckRepository.update.mockResolvedValue(null);

      await expect(truckService.updateTruck('1', { brand: 'Scania' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteTruck', () => {
    it('should delete truck successfully', async () => {
      const mockTruck = { _id: '1', registration: 'ABC123' };
      truckRepository.delete.mockResolvedValue(mockTruck as any);

      const result = await truckService.deleteTruck('1');

      expect(result).toEqual(mockTruck);
    });

    it('should throw NotFoundException if truck not found', async () => {
      truckRepository.delete.mockResolvedValue(null);

      await expect(truckService.deleteTruck('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getAllTrucks', () => {
    it('should return all trucks', async () => {
      const mockTrucks = [{ _id: '1' }, { _id: '2' }];
      truckRepository.findAll.mockResolvedValue(mockTrucks as any);

      const result = await truckService.getAllTrucks();

      expect(result).toEqual(mockTrucks);
    });
  });

  describe('getTrucksByStatus', () => {
    it('should return trucks by status', async () => {
      const mockTrucks = [{ _id: '1', status: TruckStatus.AVAILABLE }];
      truckRepository.findByStatus.mockResolvedValue(mockTrucks as any);

      const result = await truckService.getTrucksByStatus(TruckStatus.AVAILABLE);

      expect(result).toEqual(mockTrucks);
    });
  });
});
