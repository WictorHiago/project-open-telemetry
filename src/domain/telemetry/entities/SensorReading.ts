export default class SensorReading {
    public id: string;
    public deviceId: string;
    public tenantId: string;
    public value: number;
    public timestamp: Date;

    constructor(
        id: string,
        deviceId: string,
        tenantId: string,
        value: number,
        timestamp: Date,
    ) {
        this.id = id;
        this.deviceId = deviceId;
        this.tenantId = tenantId;
        this.value = value;
        this.timestamp = timestamp;
    }

    static create(
        id: string,
        deviceId: string,
        tenantId: string,
        value: number,
        timestamp: Date,
    ) {
        return new SensorReading(id, deviceId, tenantId, value, timestamp);
    }
}
