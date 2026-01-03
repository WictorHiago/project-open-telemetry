import { randomUUID } from 'crypto';
import { inject, injectable } from 'tsyringe';
import { IDeviceRepository } from '../../../domain/telemetry/repositories/IDeviceRepository';
import Device from '../../../domain/telemetry/entities/Device';
import { CreateDeviceDTO } from '../../dtos/device/CreateDeviceDTO';

@injectable()
export class CreateDeviceUseCase {
    constructor(
        @inject('DeviceRepository') private deviceRepository: IDeviceRepository,
    ) {}

    async execute(createDeviceDTO: CreateDeviceDTO): Promise<Device> {
        const device = Device.create(
            randomUUID(),
            createDeviceDTO.name,
            createDeviceDTO.tenantId,
        );
        return this.deviceRepository.create(device);
    }
}
