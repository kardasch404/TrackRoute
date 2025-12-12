import { Request, Response } from 'express';
import { UserModel } from '../../../database/models/user.model';

export class AdminController {
  async getPendingDrivers(req: Request, res: Response) {
    const drivers = await UserModel.find({ role: 'DRIVER', status: 'PENDING' }).select('-password');
    res.json(drivers);
  }

  async approveDriver(req: Request, res: Response) {
    const { userId } = req.params;
    const user = await UserModel.findByIdAndUpdate(
      userId,
      { status: 'APPROVED' },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ message: 'Driver approved successfully', user });
  }

  async rejectDriver(req: Request, res: Response) {
    const { userId } = req.params;
    const user = await UserModel.findByIdAndUpdate(
      userId,
      { status: 'REJECTED' },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ message: 'Driver rejected', user });
  }
}
