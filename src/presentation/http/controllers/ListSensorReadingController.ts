import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { ListSensorReadingUseCase } from '../../../application/usecases/sensorReading/ListSensorReadingUseCase';
export class ListSensorReadingController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { deviceId } = request.params;
        const tenantId = request.tenantId;
        try {
            if (!deviceId || !tenantId) {
                return response.status(400).json({
                    message: 'deviceId and tenantId are required',
                });
            }
            const listSensorReadingUseCase = container.resolve(
                ListSensorReadingUseCase,
            );
            const sensorReadings = await listSensorReadingUseCase.execute(
                deviceId,
                tenantId,
            );
            return response.status(200).json(sensorReadings);
        } catch (error) {
            return response
                .status(500)
                .json({ message: 'Internal server error' });
        }
    }
}
