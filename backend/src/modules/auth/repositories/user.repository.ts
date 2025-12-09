import { UserModel, IUserDocument } from '../../../database/models/user.model';
import { IUser } from '../entities/user.entity';
import { IRepository } from '../../../shared/types/common.types';

export interface IUserRepository extends IRepository<IUserDocument> {
  findByEmail(email: string): Promise<IUserDocument | null>;
}

export class UserRepository implements IUserRepository {
  async create(userData: Partial<IUser>): Promise<IUserDocument> {
    return UserModel.create(userData);
  }

  async findById(id: string): Promise<IUserDocument | null> {
    return UserModel.findById(id);
  }

  async findByEmail(email: string): Promise<IUserDocument | null> {
    return UserModel.findOne({ email });
  }

  async findAll(): Promise<IUserDocument[]> {
    return UserModel.find({ isActive: true });
  }

  async update(id: string, userData: Partial<IUser>): Promise<IUserDocument | null> {
    return UserModel.findByIdAndUpdate(id, userData, { new: true });
  }

  async delete(id: string): Promise<IUserDocument | null> {
    return UserModel.findByIdAndUpdate(id, { isActive: false }, { new: true });
  }
}
