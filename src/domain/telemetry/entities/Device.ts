export default class Device {
    public id: string;
    public name: string;
    public tenantId: string;

    constructor(id: string, name: string, tenantId: string) {
        this.id = id;
        this.name = name;
        this.tenantId = tenantId;
    }

    static create(id: string, name: string, tenantId: string) {
        return new Device(id, name, tenantId);
    }
}