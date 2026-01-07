process.env.PORT = '3002';

import request from 'supertest';
import app from '../index';
import { prisma } from '../lib/prisma';

beforeAll(async () => {
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.$disconnect();
});

beforeEach(async () => {
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();
});

describe('Address API Endpoints', () => {
  describe('POST /api/addresses', () => {
    it('should create a new address', async () => {
      const user = await prisma.user.create({
        data: { name: 'John Doe', email: 'john@example.com', age: 30 }
      });

      const newAddress = {
        street: '123 Main St',
        city: 'Test City',
        zipCode: '12345',
        country: 'Test Country',
        userId: user.id
      };

      const response = await request(app)
        .post('/api/addresses')
        .send(newAddress)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Address created successfully');
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.street).toBe(newAddress.street);
      expect(response.body.data.city).toBe(newAddress.city);
      expect(response.body.data.userId).toBe(user.id);
    });

    it('should return 400 if required fields are missing', async () => {
      const invalidAddress = {
        street: '123 Main St'
        // missing city, zipCode, country, userId
      };

      const response = await request(app)
        .post('/api/addresses')
        .send(invalidAddress)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('All fields are required');
    });

    it('should return 404 if user does not exist', async () => {
      const addressData = {
        street: '123 Main St',
        city: 'Test City',
        zipCode: '12345',
        country: 'Test Country',
        userId: 999
      };

      const response = await request(app)
        .post('/api/addresses')
        .send(addressData)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('User not found');
    });
  });

  describe('GET /api/addresses', () => {
    it('should return empty array when no addresses exist', async () => {
      const response = await request(app)
        .get('/api/addresses')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual([]);
      expect(response.body.count).toBe(0);
    });

    it('should return all addresses with user data', async () => {
      const user = await prisma.user.create({
        data: { name: 'John Doe', email: 'john@example.com', age: 30 }
      });

      await request(app).post('/api/addresses').send({
        street: '123 Main St',
        city: 'Test City',
        zipCode: '12345',
        country: 'Test Country',
        userId: user.id
      });

      await request(app).post('/api/addresses').send({
        street: '456 Oak St',
        city: 'Another City',
        zipCode: '67890',
        country: 'Another Country',
        userId: user.id
      });

      const response = await request(app)
        .get('/api/addresses')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.count).toBe(2);
      expect(response.body.data[0]).toHaveProperty('user');
      expect(response.body.data[0].user.name).toBe('John Doe');
    });
  });

  describe('GET /api/addresses/:id', () => {
    it('should return an address by id', async () => {
      const user = await prisma.user.create({
        data: { name: 'John Doe', email: 'john@example.com', age: 30 }
      });

      const createResponse = await request(app)
        .post('/api/addresses')
        .send({
          street: '123 Main St',
          city: 'Test City',
          zipCode: '12345',
          country: 'Test Country',
          userId: user.id
        });

      const addressId = createResponse.body.data.id;

      const response = await request(app)
        .get(`/api/addresses/${addressId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(addressId);
      expect(response.body.data.street).toBe('123 Main St');
      expect(response.body.data.user.name).toBe('John Doe');
    });

    it('should return 404 if address not found', async () => {
      const response = await request(app)
        .get('/api/addresses/999')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Address not found');
    });

    it('should return 400 for invalid id', async () => {
      const response = await request(app)
        .get('/api/addresses/invalid')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid address ID');
    });
  });

  describe('GET /api/addresses/user/:userId', () => {
    it('should return addresses for a specific user', async () => {
      const user1 = await prisma.user.create({
        data: { name: 'User 1', email: 'user1@example.com' }
      });

      const user2 = await prisma.user.create({
        data: { name: 'User 2', email: 'user2@example.com' }
      });

      await request(app).post('/api/addresses').send({
        street: 'Address 1',
        city: 'City 1',
        zipCode: '11111',
        country: 'Country 1',
        userId: user1.id
      });

      await request(app).post('/api/addresses').send({
        street: 'Address 2',
        city: 'City 2',
        zipCode: '22222',
        country: 'Country 2',
        userId: user1.id
      });

      await request(app).post('/api/addresses').send({
        street: 'Address 3',
        city: 'City 3',
        zipCode: '33333',
        country: 'Country 3',
        userId: user2.id
      });

      const response = await request(app)
        .get(`/api/addresses/user/${user1.id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.count).toBe(2);
      expect(response.body.data.every((addr: any) => addr.userId === user1.id)).toBe(true);
    });

    it('should return 400 for invalid user id', async () => {
      const response = await request(app)
        .get('/api/addresses/user/invalid')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid user ID');
    });
  });

  describe('PATCH /api/addresses/:id', () => {
    it('should update an address', async () => {
      const user = await prisma.user.create({
        data: { name: 'John Doe', email: 'john@example.com', age: 30 }
      });

      const createResponse = await request(app)
        .post('/api/addresses')
        .send({
          street: '123 Main St',
          city: 'Test City',
          zipCode: '12345',
          country: 'Test Country',
          userId: user.id
        });

      const addressId = createResponse.body.data.id;

      const updateData = {
        street: '456 Updated St',
        city: 'Updated City'
      };

      const response = await request(app)
        .patch(`/api/addresses/${addressId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Address updated successfully');
      expect(response.body.data.street).toBe(updateData.street);
      expect(response.body.data.city).toBe(updateData.city);
      expect(response.body.data.zipCode).toBe('12345'); // unchanged
    });

    it('should return 404 if address not found', async () => {
      const response = await request(app)
        .patch('/api/addresses/999')
        .send({ street: 'Test' })
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Address not found');
    });

    it('should return 400 for invalid id', async () => {
      const response = await request(app)
        .patch('/api/addresses/invalid')
        .send({ street: 'Test' })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid address ID');
    });
  });

  describe('DELETE /api/addresses/:id', () => {
    it('should delete an address', async () => {
      const user = await prisma.user.create({
        data: { name: 'John Doe', email: 'john@example.com', age: 30 }
      });

      const createResponse = await request(app)
        .post('/api/addresses')
        .send({
          street: '123 Main St',
          city: 'Test City',
          zipCode: '12345',
          country: 'Test Country',
          userId: user.id
        });

      const addressId = createResponse.body.data.id;

      const response = await request(app)
        .delete(`/api/addresses/${addressId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Address deleted successfully');

      // Verify address is deleted
      await request(app)
        .get(`/api/addresses/${addressId}`)
        .expect(404);
    });

    it('should return 404 if address not found', async () => {
      const response = await request(app)
        .delete('/api/addresses/999')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Address not found');
    });

    it('should return 400 for invalid id', async () => {
      const response = await request(app)
        .delete('/api/addresses/invalid')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid address ID');
    });
  });
});