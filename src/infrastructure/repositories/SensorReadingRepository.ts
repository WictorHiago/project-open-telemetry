import { injectable } from 'tsyringe';
import { db } from '../database/drizzle/datasource';
import { sensorReadings } from '../database/drizzle/schemas/schema';
import { ISensorReadingRepository } from '../../domain/telemetry/repositories/ISensorReadingRepository';
import { desc, eq } from 'drizzle-orm';
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

    async findById(id: string): Promise<SensorReading | null> {
        const database = await db;

        const sensorReading = await database
            .select()
            .from(sensorReadings)
            .where(eq(sensorReadings.id, id));

        const foundSensorReading = sensorReading[0];
        return foundSensorReading
            ? (SensorReading.create(
                  foundSensorReading.id,
                  foundSensorReading.deviceId,
                  foundSensorReading.tenantId,
                  parseFloat(foundSensorReading.value),
                  foundSensorReading.timestamp,
              ) as SensorReading)
            : null;
    }

    async findByDeviceId(deviceId: string): Promise<SensorReading | null> {
        const database = await db;

        const sensorReading = await database
            .select()
            .from(sensorReadings)
            .where(eq(sensorReadings.deviceId, deviceId));

        const foundSensorReading = sensorReading[0];
        return foundSensorReading
            ? (SensorReading.create(
                  foundSensorReading.id,
                  foundSensorReading.deviceId,
                  foundSensorReading.tenantId,
                  parseFloat(foundSensorReading.value),
                  foundSensorReading.timestamp,
              ) as SensorReading)
            : null;
    }

    async findAllByDeviceId(deviceId: string): Promise<SensorReading[]> {
        const database = await db;

        const sensorReadingList = await database
            .select()
            .from(sensorReadings)
            .where(eq(sensorReadings.deviceId, deviceId))
            .orderBy(desc(sensorReadings.timestamp));

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
