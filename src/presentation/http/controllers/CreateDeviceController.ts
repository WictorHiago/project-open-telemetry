import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { CreateDeviceUseCase } from '../../../application/usecases/device/CreateDeviceUseCase';
import { CreateDeviceRequestDTO } from '../dtos/device/CreateDeviceRequestDTO';
import { CreateDeviceResponseDTO } from '../dtos/device/CreateDeviceResponseDTO';

export class CreateDeviceController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { name } = request.body;
        const tenantIdHeader =
            request.headers['tenant-id'] ?? request.headers['tenantId'];
        const tenantId = Array.isArray(tenantIdHeader)
            ? tenantIdHeader[0]
            : tenantIdHeader;

        if (!name || !tenantId) {
            return response
                .status(400)
                .json({ message: 'name e tenantId são obrigatórios.' });
        }

        const createDeviceUseCase = container.resolve(CreateDeviceUseCase);
        const payload: CreateDeviceRequestDTO = {
            name,
            tenantId,
        };

        const device = await createDeviceUseCase.execute(payload);

        const responsePayload: CreateDeviceResponseDTO = {
            id: device.id,
            name: device.name,
            tenantId: device.tenantId,
        };

        return response.status(201).json(responsePayload);
    }
}
