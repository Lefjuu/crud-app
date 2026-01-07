import { prisma } from '../lib/prisma';
import { CreateUserDTO, UpdateUserDTO } from '../models/user.model';
import { User } from '@prisma/client';

export class UserService {
  async getAllUsers(): Promise<User[]> {
    return await prisma.user.findMany({
      orderBy: { id: 'desc' }
    });
  }

  async getUserById(id: number): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { id }
    });
  }

  async createUser(userData: CreateUserDTO): Promise<User> {
    return await prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        age: userData.age
      }
    });
  }

  async updateUser(id: number, userData: UpdateUserDTO): Promise<User | null> {
    const existingUser = await this.getUserById(id);
    if (!existingUser) {
      return null;
    }

    return await prisma.user.update({
      where: { id },
      data: userData
    });
  }

  async deleteUser(id: number): Promise<boolean> {
    const existingUser = await this.getUserById(id);
    if (!existingUser) {
      return false;
    }

    await prisma.user.delete({
      where: { id }
    });
    return true;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { email }
    });
  }
}
