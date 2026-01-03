import { Router } from 'express';
import { CreateTenantController } from '../controllers/CreateTenantController';
import { container } from 'tsyringe';

const tenantRoutes = Router();
const createTenantController = container.resolve(CreateTenantController);

tenantRoutes.post('/', createTenantController.handle);

export default tenantRoutes;
