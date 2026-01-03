export interface ISensorReadingRepository{
    // criar um novo registro de leitura
    create(sensorReading: SensorReading): Promise<SensorReading>
    // buscar por id
    findById(id: string): Promise<SensorReading | null>
    // buscar por deviceId
    findByDeviceId(deviceId: string): Promise<SensorReading | null>
    // listar todos os registros de um dispositivo
    findAllByDeviceId(deviceId: string): Promise<SensorReading[]>
}