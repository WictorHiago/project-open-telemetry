import { Request, Response } from 'express';
import { container } from 'tsyringe';
import LoginUseCase from '../../../application/usecases/auth/LoginUseCase';
import LoginDTO from '../../../application/dtos/login/LoginDTO';

export class AuthController {
    async handle(request: Request, response: Response): Promise<Response> {
        try {
            const { username, password } = request.body;

            if (!username || !password) {
                return response
                    .status(400)
                    .json({ message: 'Username and password are required' });
            }

            const loginUseCase = container.resolve(LoginUseCase);

            const payload: LoginDTO = {
                username,
                password,
            };

            const login = await loginUseCase.execute(payload);

            return response.status(200).json(login);
        } catch (error) {
            return response.status(401).json({
                message:
                    error instanceof Error
                        ? error.message
                        : 'Invalid credentials',
            });
        }
    }
}
