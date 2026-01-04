import { randomUUID } from 'crypto';
import { inject, injectable } from 'tsyringe';
import { IDeviceRepository } from '../../../domain/telemetry/repositories/IDeviceRepository';
import Device from '../../../domain/telemetry/entities/Device';
import { CreateDeviceDTO } from '../../dtos/device/CreateDeviceDTO';
import { ITenantRepository } from '../../../domain/telemetry/repositories/ITenantRepository';

@injectable()
export class CreateDeviceUseCase {
    constructor(
        @inject('DeviceRepository') private deviceRepository: IDeviceRepository,
        @inject('TenantRepository') private tenantRepository: ITenantRepository,
    ) {}

    async execute(
        createDeviceDTO: CreateDeviceDTO,
        authenticatedTenantId: string,
    ): Promise<Device> {
        if (createDeviceDTO.tenantId !== authenticatedTenantId) {
            throw new Error(
                'Unauthorized: you are not authorized to create a device for this tenant',
            );
        }

        const tenant = await this.tenantRepository.findById(
            createDeviceDTO.tenantId,
        );

        if (!tenant) {
            throw new Error('Tenant not found');
        }

        const device = Device.create(
            randomUUID(),
            createDeviceDTO.name,
            createDeviceDTO.tenantId,
        );

        const createdDevice = await this.deviceRepository.create(device);

        return createdDevice;
    }
}
