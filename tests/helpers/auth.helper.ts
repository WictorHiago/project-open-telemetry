import request from 'supertest';
import { app } from '../../src/infrastructure/server/app';

export async function createTenant(username: string, password: string) {
    const response = await request(app)
        .post('/api/v1/tenant')
        .send({ username, password });

    if (response.status !== 201) {
        throw new Error(
            `Failed to create tenant: ${response.status} - ${JSON.stringify(
                response.body,
            )}`,
        );
    }

    return response.body;
}

export async function loginTenant(username: string, password: string) {
    const response = await request(app)
        .post('/api/v1/auth/login')
        .send({ username, password });

    if (response.status !== 200) {
        throw new Error(
            `Failed to login: ${response.status} - ${JSON.stringify(
                response.body,
            )}`,
        );
    }

    return response.body; // { token, tenantId, username }
}

export async function createDevice(token: string, name: string) {
    const response = await request(app)
        .post('/api/v1/device')
        .set('Authorization', `Bearer ${token}`)
        .send({ name });

    if (response.status !== 201) {
        throw new Error(
            `Failed to create device: ${response.status} - ${JSON.stringify(
                response.body,
            )}`,
        );
    }

    return response.body; // { id, name, tenantId }
}

export async function createSensorReading(
    token: string,
    deviceId: string,
    value: number,
) {
    const response = await request(app)
        .post('/api/v1/telemetry')
        .set('Authorization', `Bearer ${token}`)
        .send({ deviceId, value });

    if (response.status !== 201) {
        throw new Error(
            `Failed to create sensor reading: ${
                response.status
            } - ${JSON.stringify(response.body)}`,
        );
    }

    return response.body;
}
