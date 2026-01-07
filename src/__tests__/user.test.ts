process.env.PORT = '3001';

import request from 'supertest';
import app from '../index';
import { prisma } from '../lib/prisma';

beforeAll(async () => {
  // Connect to database
  await prisma.$connect();
});

afterAll(async () => {
  // Disconnect from database
  await prisma.$disconnect();
});

beforeEach(async () => {
  // Clear users table before each test
  await prisma.user.deleteMany();
});

describe('User API Endpoints', () => {
  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      const newUser = {
        name: 'Jan Kowalski',
        email: 'jan.kowalski@example.com',
        age: 25
      };

      const response = await request(app)
        .post('/api/users')
        .send(newUser)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('User created successfully');
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.name).toBe(newUser.name);
      expect(response.body.data.email).toBe(newUser.email);
      expect(response.body.data.age).toBe(newUser.age);
    });

    it('should return 400 if name is missing', async () => {
      const invalidUser = {
        email: 'test@example.com'
      };

      const response = await request(app)
        .post('/api/users')
        .send(invalidUser)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Name and email are required');
    });

    it('should return 400 if email is missing', async () => {
      const invalidUser = {
        name: 'Jan Kowalski'
      };

      const response = await request(app)
        .post('/api/users')
        .send(invalidUser)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should return 409 if email already exists', async () => {
      const user = {
        name: 'Jan Kowalski',
        email: 'jan@example.com',
        age: 25
      };

      await request(app).post('/api/users').send(user);

      const response = await request(app)
        .post('/api/users')
        .send(user)
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('User with this email already exists');
    });
  });

  describe('GET /api/users', () => {
    it('should return empty array when no users exist', async () => {
      const response = await request(app)
        .get('/api/users')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual([]);
      expect(response.body.count).toBe(0);
    });

    it('should return all users', async () => {
      const users = [
        { name: 'User 1', email: 'user1@example.com', age: 20 },
        { name: 'User 2', email: 'user2@example.com', age: 30 }
      ];

      for (const user of users) {
        await request(app).post('/api/users').send(user);
      }

      const response = await request(app)
        .get('/api/users')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.count).toBe(2);
    });
  });

  describe('GET /api/users/:id', () => {
    it('should return a user by id', async () => {
      const newUser = {
        name: 'Jan Kowalski',
        email: 'jan@example.com',
        age: 25
      };

      const createResponse = await request(app)
        .post('/api/users')
        .send(newUser);

      const userId = createResponse.body.data.id;

      const response = await request(app)
        .get(`/api/users/${userId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(userId);
      expect(response.body.data.name).toBe(newUser.name);
    });

    it('should return 404 if user not found', async () => {
      const response = await request(app)
        .get('/api/users/999')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('User not found');
    });

    it('should return 400 for invalid id', async () => {
      const response = await request(app)
        .get('/api/users/invalid')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid user ID');
    });
  });

  describe('PATCH /api/users/:id', () => {
    it('should update a user', async () => {
      const newUser = {
        name: 'Jan Kowalski',
        email: 'jan@example.com',
        age: 25
      };

      const createResponse = await request(app)
        .post('/api/users')
        .send(newUser);

      const userId = createResponse.body.data.id;

      const updateData = {
        name: 'Jan Nowak',
        age: 26
      };

      const response = await request(app)
        .patch(`/api/users/${userId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('User updated successfully');
      expect(response.body.data.name).toBe(updateData.name);
      expect(response.body.data.age).toBe(updateData.age);
      expect(response.body.data.email).toBe(newUser.email);
    });

    it('should return 404 if user not found', async () => {
      const response = await request(app)
        .patch('/api/users/999')
        .send({ name: 'Test' })
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('User not found');
    });

    it('should return 409 if email already exists', async () => {
      const user1 = {
        name: 'User 1',
        email: 'user1@example.com',
        age: 20
      };

      const user2 = {
        name: 'User 2',
        email: 'user2@example.com',
        age: 30
      };

      await request(app).post('/api/users').send(user1);
      const createResponse = await request(app).post('/api/users').send(user2);
      
      const userId = createResponse.body.data.id;

      const response = await request(app)
        .patch(`/api/users/${userId}`)
        .send({ email: 'user1@example.com' })
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('User with this email already exists');
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should delete a user', async () => {
      const newUser = {
        name: 'Jan Kowalski',
        email: 'jan@example.com',
        age: 25
      };

      const createResponse = await request(app)
        .post('/api/users')
        .send(newUser);

      const userId = createResponse.body.data.id;

      const response = await request(app)
        .delete(`/api/users/${userId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('User deleted successfully');

      // Verify user is deleted
      await request(app)
        .get(`/api/users/${userId}`)
        .expect(404);
    });

    it('should return 404 if user not found', async () => {
      const response = await request(app)
        .delete('/api/users/999')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('User not found');
    });

    it('should return 400 for invalid id', async () => {
      const response = await request(app)
        .delete('/api/users/invalid')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid user ID');
    });
  });
});
