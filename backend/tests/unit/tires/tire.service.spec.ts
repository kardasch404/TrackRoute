import { TireService } from '../../../src/modules/tires/services/tire.service';
import { ITireRepository } from '../../../src/modules/tires/repositories/tire.repository';
import { NotFoundException } from '../../../src/shared/exceptions/not-found.exception';
import { TireStatus, VehicleType } from '../../../src/shared/constants/status.constant';

describe('TireService', () => {
  let tireService: TireService;
  let tireRepository: jest.Mocked<ITireRepository>;

  beforeEach(() => {
    tireRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByVehicle: jest.fn(),
      findByStatus: jest.fn(),
      findAll: jest.fn(),
      findNeedingReplacement: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findWithPagination: jest.fn(),
    } as any;

    tireService = new TireService(tireRepository);
  });

  describe('createTire', () => {
    it('should create tire successfully', async () => {
      const tireData = {
        vehicle: 'truck123',
        vehicleType: VehicleType.TRUCK,
        position: 'Front Left',
        brand: 'Michelin',
        installKm: 10000,
        currentKm: 10000,
        maxLifeKm: 100000,
      };

      const mockTire = { _id: '1', ...tireData, status: TireStatus.GOOD };

      tireRepository.create.mockResolvedValue(mockTire as any);

      const result = await tireService.createTire(tireData);

      expect(tireRepository.create).toHaveBeenCalledWith(tireData);
      expect(result).toEqual(mockTire);
    });
  });

  describe('getTireById', () => {
    it('should return tire by id', async () => {
      const mockTire = { _id: '1', brand: 'Michelin' };
      tireRepository.findById.mockResolvedValue(mockTire as any);

      const result = await tireService.getTireById('1');

      expect(result).toEqual(mockTire);
    });

    it('should throw NotFoundException if tire not found', async () => {
      tireRepository.findById.mockResolvedValue(null);

      await expect(tireService.getTireById('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getTiresByVehicle', () => {
    it('should return tires for a vehicle', async () => {
      const mockTires = [
        { _id: '1', vehicle: 'truck123', position: 'Front Left' },
        { _id: '2', vehicle: 'truck123', position: 'Front Right' },
      ];

      tireRepository.findByVehicle.mockResolvedValue(mockTires as any);

      const result = await tireService.getTiresByVehicle('truck123');

      expect(tireRepository.findByVehicle).toHaveBeenCalledWith('truck123');
      expect(result).toEqual(mockTires);
    });
  });

  describe('getTiresByStatus', () => {
    it('should return tires by status', async () => {
      const mockTires = [{ _id: '1', status: TireStatus.WORN }];
      tireRepository.findByStatus.mockResolvedValue(mockTires as any);

      const result = await tireService.getTiresByStatus(TireStatus.WORN);

      expect(result).toEqual(mockTires);
    });
  });

  describe('updateTire', () => {
    it('should update tire successfully', async () => {
      const updateData = { currentKm: 50000, status: TireStatus.WORN };
      const mockTire = { _id: '1', currentKm: 50000, status: TireStatus.WORN };

      tireRepository.update.mockResolvedValue(mockTire as any);

      const result = await tireService.updateTire('1', updateData);

      expect(result).toEqual(mockTire);
    });

    it('should throw NotFoundException if tire not found', async () => {
      tireRepository.update.mockResolvedValue(null);

      await expect(tireService.updateTire('1', { currentKm: 50000 })).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteTire', () => {
    it('should delete tire successfully', async () => {
      const mockTire = { _id: '1', brand: 'Michelin' };
      tireRepository.delete.mockResolvedValue(mockTire as any);

      const result = await tireService.deleteTire('1');

      expect(result).toEqual(mockTire);
    });

    it('should throw NotFoundException if tire not found', async () => {
      tireRepository.delete.mockResolvedValue(null);

      await expect(tireService.deleteTire('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getAllTires', () => {
    it('should return all tires', async () => {
      const mockTires = [{ _id: '1' }, { _id: '2' }];
      tireRepository.findAll.mockResolvedValue(mockTires as any);

      const result = await tireService.getAllTires();

      expect(result).toEqual(mockTires);
    });
  });
});
