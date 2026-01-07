import { Router } from 'express';
import { AddressController } from '../controllers/address.controller';

const router = Router();
const addressController = new AddressController();

/**
 * @swagger
 * components:
 *   schemas:
 *     Address:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         street:
 *           type: string
 *           example: "123 Main St"
 *         city:
 *           type: string
 *           example: "Warsaw"
 *         zipCode:
 *           type: string
 *           example: "00-001"
 *         country:
 *           type: string
 *           example: "Poland"
 *         userId:
 *           type: integer
 *           example: 1
 *         user:
 *           $ref: '#/components/schemas/User'
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *     CreateAddressDTO:
 *       type: object
 *       required:
 *         - street
 *         - city
 *         - zipCode
 *         - country
 *         - userId
 *       properties:
 *         street:
 *           type: string
 *           example: "123 Main St"
 *         city:
 *           type: string
 *           example: "Warsaw"
 *         zipCode:
 *           type: string
 *           example: "00-001"
 *         country:
 *           type: string
 *           example: "Poland"
 *         userId:
 *           type: integer
 *           example: 1
 */

/**
 * @swagger
 * /api/addresses:
 *   get:
 *     summary: Get all addresses
 *     tags: [Addresses]
 *     description: Retrieve a list of all addresses from the database
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Address'
 *                 count:
 *                   type: integer
 *                   example: 2
 */
router.get('/', (req, res) => addressController.getAllAddresses(req, res));

/**
 * @swagger
 * /api/addresses/{id}:
 *   get:
 *     summary: Get address by ID
 *     tags: [Addresses]
 *     description: Retrieve a specific address by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Address ID
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Address'
 */
router.get('/:id', (req, res) => addressController.getAddressById(req, res));

/**
 * @swagger
 * /api/users/{userId}/addresses:
 *   get:
 *     summary: Get addresses by user ID
 *     tags: [Addresses]
 *     description: Retrieve all addresses for a specific user
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: User ID
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Address'
 */
router.get('/user/:userId', (req, res) => addressController.getAddressesByUserId(req, res));

/**
 * @swagger
 * /api/addresses:
 *   post:
 *     summary: Create a new address
 *     tags: [Addresses]
 *     description: Add a new address to the database
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAddressDTO'
 *     responses:
 *       201:
 *         description: Address created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Address created successfully
 *                 data:
 *                   $ref: '#/components/schemas/Address'
 */
router.post('/', (req, res) => addressController.createAddress(req, res));

/**
 * @swagger
 * /api/addresses/{id}:
 *   patch:
 *     summary: Update address
 *     tags: [Addresses]
 *     description: Partially update an existing address
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Address ID
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               street:
 *                 type: string
 *                 example: "456 Oak St"
 *               city:
 *                 type: string
 *                 example: "Krakow"
 *               zipCode:
 *                 type: string
 *                 example: "30-001"
 *               country:
 *                 type: string
 *                 example: "Poland"
 *     responses:
 *       200:
 *         description: Address updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Address updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/Address'
 */
router.patch('/:id', (req, res) => addressController.updateAddress(req, res));

/**
 * @swagger
 * /api/addresses/{id}:
 *   delete:
 *     summary: Delete address
 *     tags: [Addresses]
 *     description: Remove an address from the database
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Address ID
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Address deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Address deleted successfully
 */
router.delete('/:id', (req, res) => addressController.deleteAddress(req, res));

export default router;