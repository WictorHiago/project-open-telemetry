import { inject, injectable } from "tsyringe";
import { IDeviceRepository } from "../../../domain/telemetry/repositories/IDeviceRepository";
import Device from "../../../domain/telemetry/entities/Device";

interface CreateDeviceDTO {
    id: string;
    name: string;
    tenantId: string;
}

@injectable()
export class CreateDeviceUseCase {
    constructor(@inject("DeviceRepository") private deviceRepository: IDeviceRepository) {}

    async execute(createDeviceDTO: CreateDeviceDTO): Promise<Device> {
        const device = Device.create(createDeviceDTO.id, createDeviceDTO.name, createDeviceDTO.tenantId);
        return this.deviceRepository.create(device);
    }
}