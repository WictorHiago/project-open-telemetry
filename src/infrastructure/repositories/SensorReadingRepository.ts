import { injectable } from 'tsyringe';
import { db } from '../database/drizzle/datasource';
import { sensorReadings } from '../database/drizzle/schemas/schema';
import { ISensorReadingRepository } from '../../domain/telemetry/repositories/ISensorReadingRepository';
import { and, desc, eq } from 'drizzle-orm';
import SensorReading from '../../domain/telemetry/entities/SensorReading';

@injectable()
export class SensorReadingRepository implements ISensorReadingRepository {
    async create(sensorReading: SensorReading): Promise<SensorReading> {
        const database = await db;

        const newSensorReading = await database
            .insert(sensorReadings)
            .values({
                id: sensorReading.id,
                deviceId: sensorReading.deviceId,
                tenantId: sensorReading.tenantId,
                value: sensorReading.value.toString(),
            })
            .returning();

        const createdSensorReading = newSensorReading[0];

        if (!createdSensorReading) {
            throw new Error('Failed to create sensor reading');
        }

        return SensorReading.create(
            createdSensorReading.id,
            createdSensorReading.deviceId,
            createdSensorReading.tenantId,
            parseFloat(createdSensorReading.value),
            createdSensorReading.timestamp,
        );
    }

    async findAllByDeviceIdAndTenantId(
        deviceId: string,
        tenantId: string,
    ): Promise<SensorReading[]> {
        const database = await db;

        const sensorReadingList = await database
            .select()
            .from(sensorReadings)
            .where(
                and(
                    eq(sensorReadings.deviceId, deviceId),
                    eq(sensorReadings.tenantId, tenantId),
                ),
            )
            .orderBy(desc(sensorReadings.timestamp))
            .limit(10);

        return sensorReadingList.map((sensorReading) =>
            SensorReading.create(
                sensorReading.id,
                sensorReading.deviceId,
                sensorReading.tenantId,
                parseFloat(sensorReading.value),
                sensorReading.timestamp,
            ),
        ) as SensorReading[];
    }
}
