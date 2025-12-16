import { Request, Response, NextFunction } from 'express';
import { TruckService } from '../services/truck.service';
import { TruckRepository } from '../repositories/truck.repository';

export class TruckController {
  private truckService: TruckService;

  constructor() {
    this.truckService = new TruckService(new TruckRepository());
  }

  createTruck = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const truck = await this.truckService.createTruck(req.body);
      res.status(201).json({ success: true, data: truck });
    } catch (error) {
      next(error);
    }
  };

  getTruckById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const truck = await this.truckService.getTruckById(req.params.id);
      res.json({ success: true, data: truck });
    } catch (error) {
      next(error);
    }
  };

  getAllTrucks = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { status } = req.query;
      const trucks = status
        ? await this.truckService.getTrucksByStatus(status as string)
        : await this.truckService.getAllTrucks();
      res.json({ success: true, data: trucks });
    } catch (error) {
      next(error);
    }
  };

  updateTruck = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const truck = await this.truckService.updateTruck(req.params.id, req.body);
      res.json({ success: true, data: truck });
    } catch (error) {
      next(error);
    }
  };

  deleteTruck = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.truckService.deleteTruck(req.params.id);
      res.json({ success: true, message: 'Truck deleted successfully' });
    } catch (error) {
      next(error);
    }
  };
}
