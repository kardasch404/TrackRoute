import { TrailerService } from '../../../src/modules/trailers/services/trailer.service';
import { ITrailerRepository } from '../../../src/modules/trailers/repositories/trailer.repository';
import { ValidationException } from '../../../src/shared/exceptions/validation.exception';
import { NotFoundException } from '../../../src/shared/exceptions/not-found.exception';
import { TrailerStatus } from '../../../src/shared/constants/status.constant';

describe('TrailerService', () => {
  let trailerService: TrailerService;
  let trailerRepository: jest.Mocked<ITrailerRepository>;

  beforeEach(() => {
    trailerRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByRegistration: jest.fn(),
      findByStatus: jest.fn(),
      findAll: jest.fn(),
      findAvailable: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findWithPagination: jest.fn(),
    } as any;

    trailerService = new TrailerService(trailerRepository);
  });

  describe('createTrailer', () => {
    it('should create trailer successfully', async () => {
      const trailerData = {
        registration: 'TRL123',
        type: 'Flatbed',
        capacity: 25000,
      };

      const mockTrailer = { _id: '1', ...trailerData, currentKm: 0, status: TrailerStatus.AVAILABLE };

      trailerRepository.findByRegistration.mockResolvedValue(null);
      trailerRepository.create.mockResolvedValue(mockTrailer as any);

      const result = await trailerService.createTrailer(trailerData);

      expect(trailerRepository.findByRegistration).toHaveBeenCalledWith('TRL123');
      expect(result).toEqual(mockTrailer);
    });

    it('should throw ValidationException if registration exists', async () => {
      const trailerData = { registration: 'TRL123', type: 'Flatbed', capacity: 25000 };

      trailerRepository.findByRegistration.mockResolvedValue({} as any);

      await expect(trailerService.createTrailer(trailerData)).rejects.toThrow(ValidationException);
    });
  });

  describe('getTrailerById', () => {
    it('should return trailer by id', async () => {
      const mockTrailer = { _id: '1', registration: 'TRL123' };
      trailerRepository.findById.mockResolvedValue(mockTrailer as any);

      const result = await trailerService.getTrailerById('1');

      expect(result).toEqual(mockTrailer);
    });

    it('should throw NotFoundException if trailer not found', async () => {
      trailerRepository.findById.mockResolvedValue(null);

      await expect(trailerService.getTrailerById('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateTrailer', () => {
    it('should update trailer successfully', async () => {
      const updateData = { capacity: 30000 };
      const mockTrailer = { _id: '1', registration: 'TRL123', capacity: 30000 };

      trailerRepository.update.mockResolvedValue(mockTrailer as any);

      const result = await trailerService.updateTrailer('1', updateData);

      expect(result).toEqual(mockTrailer);
    });

    it('should throw NotFoundException if trailer not found', async () => {
      trailerRepository.update.mockResolvedValue(null);

      await expect(trailerService.updateTrailer('1', { capacity: 30000 })).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteTrailer', () => {
    it('should delete trailer successfully', async () => {
      const mockTrailer = { _id: '1', registration: 'TRL123' };
      trailerRepository.delete.mockResolvedValue(mockTrailer as any);

      const result = await trailerService.deleteTrailer('1');

      expect(result).toEqual(mockTrailer);
    });
  });

  describe('getAllTrailers', () => {
    it('should return all trailers', async () => {
      const mockTrailers = [{ _id: '1' }, { _id: '2' }];
      trailerRepository.findAll.mockResolvedValue(mockTrailers as any);

      const result = await trailerService.getAllTrailers();

      expect(result).toEqual(mockTrailers);
    });
  });
});
