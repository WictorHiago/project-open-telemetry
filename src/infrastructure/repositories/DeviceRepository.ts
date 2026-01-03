import { injectable } from 'tsyringe';
import { IDeviceRepository } from '../../domain/telemetry/repositories/IDeviceRepository';
import Device from '../../domain/telemetry/entities/Device';
import { db } from '../database/drizzle/datasource';
import { devices } from '../database/drizzle/schemas/schema';
import { and, desc, eq } from 'drizzle-orm';

@injectable()
export class DeviceRepository implements IDeviceRepository {
    async create(device: Device): Promise<Device> {
        const database = await db;

        const createdDevice = await database
            .insert(devices)
            .values({
                id: device.id,
                name: device.name,
                tenantId: device.tenantId,
            })
            .returning();

        return createdDevice[0];
    }

    async findById(deviceId: string): Promise<Device | null> {
        const database = await db;

        const device = await database
            .select()
            .from(devices)
            .where(eq(devices.id, deviceId));

        return device[0] || null;
    }

    async findByIdAndTenant(
        deviceId: string,
        tenantId: string,
    ): Promise<Device | null> {
        const database = await db;

        const device = await database
            .select()
            .from(devices)
            .where(
                and(eq(devices.id, deviceId), eq(devices.tenantId, tenantId)),
            );

        return device[0] ?? null;
    }

    async findAllByTenant(tenantId: string): Promise<Device[]> {
        const database = await db;

        const deviceList = await database
            .select()
            .from(devices)
            .where(eq(devices.tenantId, tenantId))
            .orderBy(desc(devices.createdAt));

        return deviceList.map((device) =>
            Device.create(device.id, device.name, device.tenantId),
        ) as Device[];
    }
}
