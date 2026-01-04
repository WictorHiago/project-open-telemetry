export interface CreateSensorReadingResponseDTO {
    id: string;
    deviceId: string;
    tenantId: string;
    value: number;
    timestamp: Date;
}

