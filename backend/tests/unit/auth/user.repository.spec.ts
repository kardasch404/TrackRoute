import { UserRepository } from '../../../src/modules/auth/repositories/user.repository';
import { UserModel } from '../../../src/database/models/user.model';
import { UserRole } from '../../../src/shared/constants/roles.constant';

jest.mock('../../../src/database/models/user.model');

describe('UserRepository', () => {
  let userRepository: UserRepository;

  beforeEach(() => {
    userRepository = new UserRepository();
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        role: UserRole.DRIVER,
      };

      const mockUser = { _id: '123', ...userData };
      (UserModel.create as jest.Mock).mockResolvedValue(mockUser);

      const result = await userRepository.create(userData);

      expect(UserModel.create).toHaveBeenCalledWith(userData);
      expect(result).toEqual(mockUser);
    });
  });

  describe('findByEmail', () => {
    it('should find user by email', async () => {
      const email = 'test@example.com';
      const mockUser = { _id: '123', email };
      (UserModel.findOne as jest.Mock).mockResolvedValue(mockUser);

      const result = await userRepository.findByEmail(email);

      expect(UserModel.findOne).toHaveBeenCalledWith({ email });
      expect(result).toEqual(mockUser);
    });
  });
});
