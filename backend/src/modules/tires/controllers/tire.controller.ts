import { Request, Response, NextFunction } from 'express';
import { TireService } from '../services/tire.service';
import { TireRepository } from '../repositories/tire.repository';

export class TireController {
  private tireService: TireService;

  constructor() {
    this.tireService = new TireService(new TireRepository());
  }

  createTire = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tire = await this.tireService.createTire(req.body);
      res.status(201).json({ success: true, data: tire });
    } catch (error) {
      next(error);
    }
  };

  getTireById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tire = await this.tireService.getTireById(req.params.id);
      res.json({ success: true, data: tire });
    } catch (error) {
      next(error);
    }
  };

  getAllTires = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { vehicleId, status } = req.query;
      let tires;
      if (vehicleId) {
        tires = await this.tireService.getTiresByVehicle(vehicleId as string);
      } else if (status) {
        tires = await this.tireService.getTiresByStatus(status as string);
      } else {
        tires = await this.tireService.getAllTires();
      }
      res.json({ success: true, data: tires });
    } catch (error) {
      next(error);
    }
  };

  updateTire = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tire = await this.tireService.updateTire(req.params.id, req.body);
      res.json({ success: true, data: tire });
    } catch (error) {
      next(error);
    }
  };

  deleteTire = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.tireService.deleteTire(req.params.id);
      res.json({ success: true, message: 'Tire deleted successfully' });
    } catch (error) {
      next(error);
    }
  };
}
