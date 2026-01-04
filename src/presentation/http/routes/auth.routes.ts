import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';

const authRoutes = Router();
const authController = new AuthController();

authRoutes.post('/login', (req, res) => authController.handle(req, res));

export default authRoutes;
