import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { CreateSensorReadingUseCase } from '../../../application/usecases/sensorReading/CreateSensorReadingUseCase';
import { CreateSensorReadingDTO } from '../../../application/dtos/sensorReading/CreateSensorReadingDTO';
import { CreateSensorReadingResponseDTO } from '../../../application/dtos/sensorReading/CreateSensorReadingResponseDTO';

export class CreateSensorReadingController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { deviceId, value } = request.body;
        const tenantId = request.tenantId;

        if (!deviceId || !value || !tenantId) {
            return response.status(400).json({
                message: 'deviceId, value and tenantId are required',
            });
        }

        const createSensorReadingUseCase = container.resolve(
            CreateSensorReadingUseCase,
        );
        const payload: CreateSensorReadingDTO = {
            deviceId,
            value,
            tenantId,
        };

        try {
            const sensorReading = await createSensorReadingUseCase.execute(
                payload,
            );
            return response.status(201).json(sensorReading);
        } catch (error) {
            if (error instanceof Error) {
                if (
                    error.message.includes('Device not found') ||
                    error.message.includes('does not belong to your tenant')
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
