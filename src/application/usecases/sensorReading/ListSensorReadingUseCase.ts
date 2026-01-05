import { inject, injectable } from 'tsyringe';
import { ISensorReadingRepository } from '../../../domain/telemetry/repositories/ISensorReadingRepository';
import SensorReading from '../../../domain/telemetry/entities/SensorReading';
import { IDeviceRepository } from '../../../domain/telemetry/repositories/IDeviceRepository';

@injectable()
export class ListSensorReadingUseCase {
    constructor(
        @inject('SensorReadingRepository')
        private sensorReadingRepository: ISensorReadingRepository,
        @inject('DeviceRepository')
        private deviceRepository: IDeviceRepository,
    ) {}

    async execute(
        deviceId: string,
        tenantId: string,
    ): Promise<SensorReading[]> {
        if (!deviceId || !tenantId) {
            throw new Error('deviceId and tenantId are required');
        }

        const device = await this.deviceRepository.findByIdAndTenant(
            deviceId,
            tenantId,
        );
        if (!device) {
            throw new Error(
                'Device not found or does not belong to your tenant',
            );
        }

        const sensorReadings =
            await this.sensorReadingRepository.findAllByDeviceIdAndTenantId(
                deviceId,
                tenantId,
            );
        return sensorReadings;
    }
}
