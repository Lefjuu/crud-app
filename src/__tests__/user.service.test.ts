import { UserService } from '../services/user.service';
import { prisma } from '../lib/prisma';

const userService = new UserService();

beforeAll(async () => {
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.$disconnect();
});

beforeEach(async () => {
  await prisma.user.deleteMany();
});

describe('UserService', () => {
  describe('createUser', () => {
    it('should create a new user', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        age: 25
      };

      const user = await userService.createUser(userData);

      expect(user).toHaveProperty('id');
      expect(user.name).toBe(userData.name);
      expect(user.email).toBe(userData.email);
      expect(user.age).toBe(userData.age);
    });
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      await userService.createUser({ name: 'User 1', email: 'user1@example.com', password: 'pass1' });
      await userService.createUser({ name: 'User 2', email: 'user2@example.com', password: 'pass2' });

      const users = await userService.getAllUsers();

      expect(users).toHaveLength(2);
    });

    it('should return empty array when no users', async () => {
      const users = await userService.getAllUsers();
      expect(users).toEqual([]);
    });
  });

  describe('getUserById', () => {
    it('should return user by id', async () => {
      const created = await userService.createUser({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });

      const user = await userService.getUserById(created.id!);

      expect(user).not.toBeNull();
      expect(user?.id).toBe(created.id);
      expect(user?.name).toBe('Test User');
    });

    it('should return null for non-existent user', async () => {
      const user = await userService.getUserById(999);
      expect(user).toBeNull();
    });
  });

  describe('updateUser', () => {
    it('should update user', async () => {
      const created = await userService.createUser({
        name: 'Original Name',
        email: 'original@example.com',
        password: 'password123',
        age: 20
      });

      const updated = await userService.updateUser(created.id!, {
        name: 'Updated Name',
        age: 21
      });

      expect(updated).not.toBeNull();
      expect(updated?.name).toBe('Updated Name');
      expect(updated?.age).toBe(21);
      expect(updated?.email).toBe('original@example.com');
    });

    it('should return null for non-existent user', async () => {
      const result = await userService.updateUser(999, { name: 'Test' });
      expect(result).toBeNull();
    });
  });

  describe('deleteUser', () => {
    it('should delete user', async () => {
      const created = await userService.createUser({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });

      const deleted = await userService.deleteUser(created.id!);
      expect(deleted).toBe(true);

      const user = await userService.getUserById(created.id!);
      expect(user).toBeNull();
    });

    it('should return false for non-existent user', async () => {
      const deleted = await userService.deleteUser(999);
      expect(deleted).toBe(false);
    });
  });

  describe('getUserByEmail', () => {
    it('should return user by email', async () => {
      await userService.createUser({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });

      const user = await userService.getUserByEmail('test@example.com');

      expect(user).not.toBeNull();
      expect(user?.email).toBe('test@example.com');
    });

    it('should return null for non-existent email', async () => {
      const user = await userService.getUserByEmail('nonexistent@example.com');
      expect(user).toBeNull();
    });
  });
});
