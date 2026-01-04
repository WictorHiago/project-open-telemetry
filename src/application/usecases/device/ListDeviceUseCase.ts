import { inject, injectable } from 'tsyringe';
import { IDeviceRepository } from '../../../domain/telemetry/repositories/IDeviceRepository';
import Device from '../../../domain/telemetry/entities/Device';

@injectable()
export class ListDeviceUseCase {
    constructor(
        @inject('DeviceRepository') private deviceRepository: IDeviceRepository,
    ) {}

    async execute(authenticatedTenantId: string): Promise<Device[]> {
        const devices = await this.deviceRepository.findAllByTenant(
            authenticatedTenantId,
        );
        return devices;
    }
}
