class SensorReading {
    public id: string;
    public deviceId: string;
    public tenantId: string;
    public value: number;

    constructor(id: string, deviceId: string, tenantId: string, value: number) {
        this.id = id;
        this.deviceId = deviceId;
        this.tenantId = tenantId;
        this.value = value;
    }
}