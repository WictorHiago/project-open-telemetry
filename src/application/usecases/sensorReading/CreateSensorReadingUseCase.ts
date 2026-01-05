import { inject, injectable } from 'tsyringe';
import { ISensorReadingRepository } from '../../../domain/telemetry/repositories/ISensorReadingRepository';
import SensorReading from '../../../domain/telemetry/entities/SensorReading';
import { CreateSensorReadingDTO } from '../../dtos/sensorReading/CreateSensorReadingDTO';
import { ITenantRepository } from '../../../domain/telemetry/repositories/ITenantRepository';
import { IDeviceRepository } from '../../../domain/telemetry/repositories/IDeviceRepository';
import { CreateSensorReadingResponseDTO } from '../../dtos/sensorReading/CreateSensorReadingResponseDTO';
import { randomUUID } from 'crypto';

@injectable()
export class CreateSensorReadingUseCase {
    constructor(
        @inject('SensorReadingRepository')
        private sensorReadingRepository: ISensorReadingRepository,
        @inject('TenantRepository')
        private tenantRepository: ITenantRepository,
        @inject('DeviceRepository')
        private deviceRepository: IDeviceRepository,
    ) {}

    async execute(
        payload: CreateSensorReadingDTO,
    ): Promise<CreateSensorReadingResponseDTO> {
        const tenant = await this.tenantRepository.findById(payload.tenantId);

        if (!tenant) {
            throw new Error('Tenant not found');
        }

        const device = await this.deviceRepository.findByIdAndTenant(
            payload.deviceId,
            payload.tenantId,
        );

        if (!device) {
            throw new Error(
                'Device not found or does not belong to your tenant',
            );
        }

        const sensorReading = SensorReading.create(
            randomUUID(),
            payload.deviceId,
            payload.tenantId,
            payload.value,
            new Date(),
        );

        const createdSensorReading = await this.sensorReadingRepository.create(
            sensorReading,
        );

        return {
            id: createdSensorReading.id,
            deviceId: createdSensorReading.deviceId,
            tenantId: createdSensorReading.tenantId,
            value: createdSensorReading.value,
            timestamp: createdSensorReading.timestamp,
        };
    }
}
