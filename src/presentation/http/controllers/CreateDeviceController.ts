import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { CreateDeviceUseCase } from '../../../application/usecases/device/CreateDeviceUseCase';
import { CreateDeviceResponseDTO } from '../dtos/device/CreateDeviceResponseDTO';

export class CreateDeviceController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { name } = request.body;
        const tenantId = request.tenantId;

        if (!name || !tenantId) {
            return response
                .status(400)
                .json({ message: 'name e tenantId são obrigatórios.' });
        }

        const createDeviceUseCase = container.resolve(CreateDeviceUseCase);
        const payload = {
            name,
            tenantId,
        };

        try {
            const device = await createDeviceUseCase.execute(payload, tenantId);

            const responsePayload: CreateDeviceResponseDTO = {
                id: device.id,
                name: device.name,
                tenantId: device.tenantId,
            };

            return response.status(201).json(responsePayload);
        } catch (error) {
            if (error instanceof Error) {
                if (
                    error.message.includes('Unauthorized') ||
                    error.message.includes('another tenant')
                ) {
                    return response
                        .status(403)
                        .json({ message: error.message });
                }
                if (error.message.includes('Tenant not found')) {
                    return response
                        .status(404)
                        .json({ message: error.message });
                }
            }
            return response
                .status(500)
                .json({ message: 'Internal server error' });
        }
    }
}
