import { Router } from 'express';
import tenantRoutes from './tenant.routes';

const routes = Router();

// routes.use('/device', deviceRoutes);
routes.use('/tenant', tenantRoutes);

export default routes;
