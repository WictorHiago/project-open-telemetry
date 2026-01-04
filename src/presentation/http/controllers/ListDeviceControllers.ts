import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { ListDeviceUseCase } from '../../../application/usecases/device/ListDeviceUseCase';

export class ListDeviceController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { tenantId } = request;
        try {
            if (!tenantId) {
                return response
                    .status(401)
                    .json({ message: 'Tenant ID is required' });
            }
            const listDeviceUseCase = container.resolve(ListDeviceUseCase);
            const devices = await listDeviceUseCase.execute(tenantId);
            return response.status(200).json(devices);
        } catch (error) {
            return response
                .status(500)
                .json({ message: 'Internal server error' });
        }
    }
}
