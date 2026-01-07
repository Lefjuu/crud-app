import { prisma } from '../lib/prisma';
import { CreateAddressDTO, UpdateAddressDTO } from '../models/address.model';

export class AddressService {
  async getAllAddresses() {
    return await prisma.address.findMany({
      include: { user: true }
    });
  }

  async getAddressById(id: number) {
    return await prisma.address.findUnique({
      where: { id },
      include: { user: true }
    });
  }

  async getAddressesByUserId(userId: number) {
    return await prisma.address.findMany({
      where: { userId },
      include: { user: true }
    });
  }

  async createAddress(data: CreateAddressDTO) {
    // Check if user exists
    const user = await prisma.user.findUnique({ where: { id: data.userId } });
    if (!user) {
      throw new Error('User not found');
    }

    return await prisma.address.create({ data });
  }

  async updateAddress(id: number, data: UpdateAddressDTO) {
    const existingAddress = await this.getAddressById(id);
    if (!existingAddress) {
      return null;
    }

    return await prisma.address.update({
      where: { id },
      data
    });
  }

  async deleteAddress(id: number) {
    const existingAddress = await this.getAddressById(id);
    if (!existingAddress) {
      return false;
    }

    await prisma.address.delete({ where: { id } });
    return true;
  }
}