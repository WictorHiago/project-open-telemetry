import { Router } from 'express';
import { CreateDeviceController } from '../controllers/CreateDeviceController';
import { container } from 'tsyringe';
import { AuthenticatedMiddleware } from '../middlewares/AuthenticatedMiddleware';
import { ListDeviceController } from '../controllers/ListDeviceController';

const deviceRoutes = Router();
const createDeviceController = container.resolve(CreateDeviceController);
const listDeviceController = container.resolve(ListDeviceController);

deviceRoutes.post('/', AuthenticatedMiddleware, createDeviceController.handle);
deviceRoutes.get('/', AuthenticatedMiddleware, listDeviceController.handle);

export default deviceRoutes;
