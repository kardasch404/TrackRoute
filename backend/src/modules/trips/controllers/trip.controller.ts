import { Request, Response, NextFunction } from 'express';
import { TripService } from '../services/trip.service';
import { TripRepository } from '../repositories/trip.repository';
import { UserRole } from '../../../shared/constants/roles.constant';

export class TripController {
  private tripService: TripService;

  constructor() {
    this.tripService = new TripService(new TripRepository());
  }

  createTrip = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const currentUserId = req.user?.userId;
      if (!currentUserId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }
      
      const trip = await this.tripService.createTrip(req.body, currentUserId);
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
      const currentUser = req.user;

      let trips;

      // If user is a driver, only show their own trips
      if (currentUser?.role === UserRole.DRIVER) {
        trips = await this.tripService.getTripsByDriver(currentUser.userId);
      } else {
        // Admin can filter by driver or status
        if (driverId) {
          trips = await this.tripService.getTripsByDriver(driverId as string);
        } else if (status) {
          trips = await this.tripService.getTripsByStatus(status as string);
        } else {
          trips = await this.tripService.getAllTrips();
        }
      }

      res.json({ success: true, data: trips });
    } catch (error) {
      next(error);
    }
  };

  getMyTrips = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const currentUserId = req.user?.userId;
      if (!currentUserId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const trips = await this.tripService.getTripsByDriver(currentUserId);
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
      const currentUserId = req.user?.userId;
      if (!currentUserId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const trip = await this.tripService.updateStatus(req.params.id, req.body.status, currentUserId);
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

  calculateTripCost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { fuelPricePerLiter } = req.body;
      const cost = await this.tripService.calculateTripCost(req.params.id, fuelPricePerLiter);
      res.json({ success: true, data: { cost } });
    } catch (error) {
      next(error);
    }
  };
}
