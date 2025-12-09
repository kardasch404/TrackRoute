import { ITrailerRepository } from '../repositories/trailer.repository';
import { CreateTrailerDto } from '../dto/create-trailer.dto';
import { UpdateTrailerDto } from '../dto/update-trailer.dto';
import { ValidationException } from '../../../shared/exceptions/validation.exception';
import { NotFoundException } from '../../../shared/exceptions/not-found.exception';

export class TrailerService {
  constructor(private readonly trailerRepository: ITrailerRepository) {}

  async createTrailer(data: CreateTrailerDto) {
    const existing = await this.trailerRepository.findByRegistration(data.registration);
    if (existing) {
      throw new ValidationException('Trailer with this registration already exists');
    }
    return this.trailerRepository.create(data);
  }

  async getTrailerById(id: string) {
    const trailer = await this.trailerRepository.findById(id);
    if (!trailer) {
      throw new NotFoundException('Trailer not found');
    }
    return trailer;
  }

  async getAllTrailers() {
    return this.trailerRepository.findAll();
  }

  async getTrailersByStatus(status: string) {
    return this.trailerRepository.findByStatus(status);
  }

  async updateTrailer(id: string, data: UpdateTrailerDto) {
    if (data.registration) {
      const existing = await this.trailerRepository.findByRegistration(data.registration);
      if (existing && existing._id.toString() !== id) {
        throw new ValidationException('Trailer with this registration already exists');
      }
    }

    const trailer = await this.trailerRepository.update(id, data);
    if (!trailer) {
      throw new NotFoundException('Trailer not found');
    }
    return trailer;
  }

  async deleteTrailer(id: string) {
    const trailer = await this.trailerRepository.delete(id);
    if (!trailer) {
      throw new NotFoundException('Trailer not found');
    }
    return trailer;
  }
}
