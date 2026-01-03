import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { CreateTenantUseCase } from '../../../application/usecases/tenant/CreateTenantUseCase';
import { CreateTenantRequestDTO } from '../dtos/tenant/CreateTenantRequestDTO';
import { CreateTenantResponseDTO } from '../dtos/tenant/CreateTenantResponseDTO';
export class CreateTenantController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { username, password } = request.body;
        if (!username || !password) {
            return response
                .status(400)
                .json({ message: 'username and password are required' });
        }

        try {
            const createTenantUseCase = container.resolve(CreateTenantUseCase);

            const payload: CreateTenantRequestDTO = {
                username,
                password,
            };

            const createdTenant = await createTenantUseCase.execute(payload);
            const responsePayload: CreateTenantResponseDTO = {
                id: createdTenant.id,
                username: createdTenant.username,
            };

            return response.status(201).json(responsePayload);
        } catch (error) {
            console.error(error);
            return response
                .status(500)
                .json({ message: (error as Error).message });
        }
    }
}
