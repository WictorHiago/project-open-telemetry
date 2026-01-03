import Device from "../entities/Device"

export interface IDeviceRepository{
    create(device: Device): Promise<Device>
    findById(deviceId: string): Promise<Device | null>
    findByIdAndTenant(deviceId: string, tenantId: string): Promise<Device | null>
    findAllByTenant(tenantId: string): Promise<Device[]>
}