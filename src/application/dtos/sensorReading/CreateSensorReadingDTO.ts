export interface CreateSensorReadingDTO {
    tenantId: string; // vem do token jwt
    deviceId: string; // vem do body
    value: number; // vem do body
}
