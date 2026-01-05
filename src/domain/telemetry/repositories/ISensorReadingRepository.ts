import SensorReading from '../entities/SensorReading';

export interface ISensorReadingRepository {
    create(sensorReading: SensorReading): Promise<SensorReading>;
    findAllByDeviceIdAndTenantId(
        deviceId: string,
        tenantId: string,
    ): Promise<SensorReading[]>;
}
