import { Request, Response } from 'express';
import { UserModel } from '../../../database/models/user.model';

export class AdminController {
  // Get all drivers with optional status filter
  async getAllDrivers(req: Request, res: Response) {
    try {
      const { status, search } = req.query;
      
      const query: Record<string, unknown> = { role: 'DRIVER' };
      
      if (status && status !== 'ALL') {
        query.status = status;
      }
      
      if (search) {
        query.$or = [
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ];
      }
      
      const drivers = await UserModel.find(query)
        .select('-password')
        .sort({ createdAt: -1 });
      
      res.json({ success: true, data: drivers });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error fetching drivers' });
    }
  }

  async getPendingDrivers(req: Request, res: Response) {
    const drivers = await UserModel.find({ role: 'DRIVER', status: 'PENDING' }).select('-password');
    res.json({ success: true, data: drivers });
  }

  async approveDriver(req: Request, res: Response) {
    const { userId } = req.params;
    const user = await UserModel.findByIdAndUpdate(
      userId,
      { status: 'APPROVED' },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.json({ success: true, message: 'Driver approved successfully', data: user });
  }

  async rejectDriver(req: Request, res: Response) {
    const { userId } = req.params;
    const user = await UserModel.findByIdAndUpdate(
      userId,
      { status: 'REJECTED' },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.json({ success: true, message: 'Driver rejected', data: user });
  }

  // Update driver status (generic)
  async updateDriverStatus(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { status } = req.body;
      
      if (!['PENDING', 'APPROVED', 'REJECTED'].includes(status)) {
        return res.status(400).json({ success: false, message: 'Invalid status' });
      }
      
      const user = await UserModel.findByIdAndUpdate(
        userId,
        { status },
        { new: true }
      ).select('-password');
      
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      
      res.json({ success: true, message: `Driver status updated to ${status}`, data: user });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error updating driver status' });
    }
  }
}
