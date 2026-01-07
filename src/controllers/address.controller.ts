import { Request, Response } from 'express';
import { AddressService } from '../services/address.service';
import { CreateAddressDTO, UpdateAddressDTO } from '../models/address.model';

const addressService = new AddressService();

export class AddressController {
  async getAllAddresses(req: Request, res: Response): Promise<void> {
    try {
      const addresses = await addressService.getAllAddresses();
      res.status(200).json({
        success: true,
        data: addresses,
        count: addresses.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching addresses',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async getAddressById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'Invalid address ID'
        });
        return;
      }

      const address = await addressService.getAddressById(id);

      if (!address) {
        res.status(404).json({
          success: false,
          message: 'Address not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: address
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching address',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async getAddressesByUserId(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.userId);

      if (isNaN(userId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid user ID'
        });
        return;
      }

      const addresses = await addressService.getAddressesByUserId(userId);
      res.status(200).json({
        success: true,
        data: addresses,
        count: addresses.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching addresses for user',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async createAddress(req: Request, res: Response): Promise<void> {
    try {
      const addressData: CreateAddressDTO = req.body;

      // Validation
      if (!addressData.street || !addressData.city || !addressData.zipCode || !addressData.country || !addressData.userId) {
        res.status(400).json({
          success: false,
          message: 'All fields are required'
        });
        return;
      }

      const newAddress = await addressService.createAddress(addressData);

      res.status(201).json({
        success: true,
        message: 'Address created successfully',
        data: newAddress
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'User not found') {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: 'Error creating address',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async updateAddress(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'Invalid address ID'
        });
        return;
      }

      const addressData: UpdateAddressDTO = req.body;

      const updatedAddress = await addressService.updateAddress(id, addressData);

      if (!updatedAddress) {
        res.status(404).json({
          success: false,
          message: 'Address not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Address updated successfully',
        data: updatedAddress
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating address',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async deleteAddress(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'Invalid address ID'
        });
        return;
      }

      const deleted = await addressService.deleteAddress(id);

      if (!deleted) {
        res.status(404).json({
          success: false,
          message: 'Address not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Address deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deleting address',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}