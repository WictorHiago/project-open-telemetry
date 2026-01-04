import { Router } from 'express';
import tenantRoutes from './tenant.routes';
import authRoutes from './auth.routes';
import deviceRoutes from './device.routes';
import { AuthenticatedMiddleware } from '../middlewares/AuthenticatedMiddleware';
import sensorReadingRoutes from './sensorReadingRoutes';

const routes = Router();

routes.use('/telemetry', AuthenticatedMiddleware, sensorReadingRoutes);
routes.use('/device', AuthenticatedMiddleware, deviceRoutes);
routes.use('/tenant', tenantRoutes);
routes.use('/auth', authRoutes);

export default routes;
