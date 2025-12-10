import { Request, Response, NextFunction } from 'express';
import { TripService } from '../services/trip.service';
import { TripRepository } from '../repositories/trip.repository';

export class TripController {
  private tripService: TripService;

  constructor() {
    this.tripService = new TripService(new TripRepository());
  }

  createTrip = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const trip = await this.tripService.createTrip(req.body);
      res.status(201).json({ success: true, data: trip });
    } catch (error) {
      next(error);
    }
  };

  getTripById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const trip = await this.tripService.getTripById(req.params.id);
      res.json({ success: true, data: trip });
    } catch (error) {
      next(error);
    }
  };

  getAllTrips = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { driverId, status } = req.query;
      let trips;
      if (driverId) {
        trips = await this.tripService.getTripsByDriver(driverId as string);
      } else if (status) {
        trips = await this.tripService.getTripsByStatus(status as string);
      } else {
        trips = await this.tripService.getAllTrips();
      }
      res.json({ success: true, data: trips });
    } catch (error) {
      next(error);
    }
  };

  updateTrip = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const trip = await this.tripService.updateTrip(req.params.id, req.body);
      res.json({ success: true, data: trip });
    } catch (error) {
      next(error);
    }
  };

  updateStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const trip = await this.tripService.updateStatus(req.params.id, req.body.status);
      res.json({ success: true, data: trip });
    } catch (error) {
      next(error);
    }
  };

  deleteTrip = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.tripService.deleteTrip(req.params.id);
      res.json({ success: true, message: 'Trip deleted successfully' });
    } catch (error) {
      next(error);
    }
  };
}
