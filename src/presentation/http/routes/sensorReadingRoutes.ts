import { Router } from 'express';
import { container } from 'tsyringe';
import { CreateSensorReadingController } from '../controllers/CreateSensorReadingController';

const sensorReadingRoutes = Router();
const createSensorReadingController = container.resolve(
    CreateSensorReadingController,
);

sensorReadingRoutes.post('/', createSensorReadingController.handle);

export default sensorReadingRoutes;
