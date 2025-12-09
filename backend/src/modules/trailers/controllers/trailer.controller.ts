import { Request, Response, NextFunction } from 'express';
import { TrailerService } from '../services/trailer.service';
import { TrailerRepository } from '../repositories/trailer.repository';

export class TrailerController {
  private trailerService: TrailerService;

  constructor() {
    this.trailerService = new TrailerService(new TrailerRepository());
  }

  createTrailer = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const trailer = await this.trailerService.createTrailer(req.body);
      res.status(201).json({ success: true, data: trailer });
    } catch (error) {
      next(error);
    }
  };

  getTrailerById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const trailer = await this.trailerService.getTrailerById(req.params.id);
      res.json({ success: true, data: trailer });
    } catch (error) {
      next(error);
    }
  };

  getAllTrailers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { status } = req.query;
      const trailers = status
        ? await this.trailerService.getTrailersByStatus(status as string)
        : await this.trailerService.getAllTrailers();
      res.json({ success: true, data: trailers });
    } catch (error) {
      next(error);
    }
  };

  updateTrailer = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const trailer = await this.trailerService.updateTrailer(req.params.id, req.body);
      res.json({ success: true, data: trailer });
    } catch (error) {
      next(error);
    }
  };

  deleteTrailer = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.trailerService.deleteTrailer(req.params.id);
      res.json({ success: true, message: 'Trailer deleted successfully' });
    } catch (error) {
      next(error);
    }
  };
}
