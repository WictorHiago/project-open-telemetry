import { Router } from 'express';
import { container } from 'tsyringe';
import { CreateSensorReadingController } from '../controllers/CreateSensorReadingController';
import { ListSensorReadingController } from '../controllers/ListSensorReadingController';

const sensorReadingRoutes = Router();
const createSensorReadingController = container.resolve(
    CreateSensorReadingController,
);
const listSensorReadingController = container.resolve(
    ListSensorReadingController,
);

sensorReadingRoutes.post('/', createSensorReadingController.handle);
sensorReadingRoutes.get('/:deviceId', listSensorReadingController.handle);

export default sensorReadingRoutes;
