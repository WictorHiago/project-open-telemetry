import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { ListSensorReadingUseCase } from '../../../application/usecases/sensorReading/ListSensorReadingUseCase';
export class ListSensorReadingController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { deviceId } = request.params;
        const tenantId = request.tenantId;
        if (!deviceId || !tenantId) {
            return response.status(400).json({
                message: 'deviceId and tenantId are required',
            });
        }

        const listSensorReadingUseCase = container.resolve(
            ListSensorReadingUseCase,
        );

        try {
            const sensorReadings = await listSensorReadingUseCase.execute(
                deviceId,
                tenantId,
            );
            return response.status(200).json(sensorReadings);
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
