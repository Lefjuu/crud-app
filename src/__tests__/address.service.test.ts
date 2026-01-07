import { AddressService } from '../services/address.service';
import { prisma } from '../lib/prisma';

const addressService = new AddressService();

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

describe('AddressService', () => {
  describe('createAddress', () => {
    it('should create a new address', async () => {
      const user = await prisma.user.create({
        data: { name: 'Test User', email: 'test@example.com', password: 'password123' }
      });

      const addressData = {
        street: '123 Main St',
        city: 'Test City',
        zipCode: '12345',
        country: 'Test Country',
        userId: user.id
      };

      const address = await addressService.createAddress(addressData);

      expect(address).toHaveProperty('id');
      expect(address.street).toBe(addressData.street);
      expect(address.city).toBe(addressData.city);
      expect(address.userId).toBe(user.id);
    });

    it('should throw error if user does not exist', async () => {
      const addressData = {
        street: '123 Main St',
        city: 'Test City',
        zipCode: '12345',
        country: 'Test Country',
        userId: 999
      };

      await expect(addressService.createAddress(addressData)).rejects.toThrow('User not found');
    });
  });

  describe('getAllAddresses', () => {
    it('should return all addresses', async () => {
      const user = await prisma.user.create({
        data: { name: 'Test User', email: 'test@example.com', password: 'password123' }
      });

      await addressService.createAddress({
        street: '123 Main St',
        city: 'Test City',
        zipCode: '12345',
        country: 'Test Country',
        userId: user.id
      });

      await addressService.createAddress({
        street: '456 Oak St',
        city: 'Another City',
        zipCode: '67890',
        country: 'Another Country',
        userId: user.id
      });

      const addresses = await addressService.getAllAddresses();

      expect(addresses).toHaveLength(2);
      expect(addresses[0]).toHaveProperty('user');
      expect(addresses[0].user.name).toBe('Test User');
    });

    it('should return empty array when no addresses', async () => {
      const addresses = await addressService.getAllAddresses();
      expect(addresses).toEqual([]);
    });
  });

  describe('getAddressById', () => {
    it('should return address by id', async () => {
      const user = await prisma.user.create({
        data: { name: 'Test User', email: 'test@example.com', password: 'password123' }
      });

      const address = await addressService.createAddress({
        street: '123 Main St',
        city: 'Test City',
        zipCode: '12345',
        country: 'Test Country',
        userId: user.id
      });

      const foundAddress = await addressService.getAddressById(address.id);

      expect(foundAddress).toBeTruthy();
      expect(foundAddress?.id).toBe(address.id);
      expect(foundAddress?.user.name).toBe('Test User');
    });

    it('should return null for non-existent address', async () => {
      const address = await addressService.getAddressById(999);
      expect(address).toBeNull();
    });
  });

  describe('getAddressesByUserId', () => {
    it('should return addresses for user', async () => {
      const user1 = await prisma.user.create({
        data: { name: 'User 1', email: 'user1@example.com', password: 'pass1' }
      });

      const user2 = await prisma.user.create({
        data: { name: 'User 2', email: 'user2@example.com', password: 'pass2' }
      });

      await addressService.createAddress({
        street: '123 Main St',
        city: 'Test City',
        zipCode: '12345',
        country: 'Test Country',
        userId: user1.id
      });

      await addressService.createAddress({
        street: '456 Oak St',
        city: 'Another City',
        zipCode: '67890',
        country: 'Another Country',
        userId: user1.id
      });

      await addressService.createAddress({
        street: '789 Pine St',
        city: 'Third City',
        zipCode: '11111',
        country: 'Third Country',
        userId: user2.id
      });

      const addresses = await addressService.getAddressesByUserId(user1.id);

      expect(addresses).toHaveLength(2);
      expect(addresses.every(addr => addr.userId === user1.id)).toBe(true);
    });
  });

  describe('updateAddress', () => {
    it('should update address', async () => {
      const user = await prisma.user.create({
        data: { name: 'Test User', email: 'test@example.com', password: 'password123' }
      });

      const address = await addressService.createAddress({
        street: '123 Main St',
        city: 'Test City',
        zipCode: '12345',
        country: 'Test Country',
        userId: user.id
      });

      const updateData = {
        street: '456 Updated St',
        city: 'Updated City'
      };

      const updatedAddress = await addressService.updateAddress(address.id, updateData);

      expect(updatedAddress).toBeTruthy();
      expect(updatedAddress?.street).toBe(updateData.street);
      expect(updatedAddress?.city).toBe(updateData.city);
      expect(updatedAddress?.zipCode).toBe('12345'); // unchanged
    });

    it('should return null for non-existent address', async () => {
      const result = await addressService.updateAddress(999, { street: 'Test' });
      expect(result).toBeNull();
    });
  });

  describe('deleteAddress', () => {
    it('should delete address', async () => {
      const user = await prisma.user.create({
        data: { name: 'Test User', email: 'test@example.com', password: 'password123' }
      });

      const address = await addressService.createAddress({
        street: '123 Main St',
        city: 'Test City',
        zipCode: '12345',
        country: 'Test Country',
        userId: user.id
      });

      const deleted = await addressService.deleteAddress(address.id);
      expect(deleted).toBe(true);

      const foundAddress = await addressService.getAddressById(address.id);
      expect(foundAddress).toBeNull();
    });

    it('should return false for non-existent address', async () => {
      const deleted = await addressService.deleteAddress(999);
      expect(deleted).toBe(false);
    });
  });
});