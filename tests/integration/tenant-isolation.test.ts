import request from 'supertest';
import { app } from '../../src/infrastructure/server/app';
import {
    cleanDatabase,
    setupTestDatabase,
    closeDatabase,
} from '../helpers/database.helper';
import {
    createTenant,
    loginTenant,
    createDevice,
    createSensorReading,
} from '../helpers/auth.helper';

describe('Tenant Isolation - Sensor Readings', () => {
    beforeAll(async () => {
        await setupTestDatabase();
    });

    beforeEach(async () => {
        await cleanDatabase();
    });

    afterAll(async () => {
        await closeDatabase();
    });

    describe('GET /api/v1/telemetry/:deviceId - Listar sensor readings', () => {
        it('deve permitir que Tenant A liste seus próprios sensor readings', async () => {
            // Arrange: Criar Tenant A e um device
            await createTenant('TENANT_A', '123123');
            const { token: tokenA } = await loginTenant('TENANT_A', '123123');
            const { id: deviceA } = await createDevice(tokenA, 'Device A1');

            // Criar 3 sensor readings para o Device A
            await createSensorReading(tokenA, deviceA, 25.5);
            await createSensorReading(tokenA, deviceA, 26.3);
            await createSensorReading(tokenA, deviceA, 27.1);

            // Act: Listar sensor readings do Device A
            const response = await request(app)
                .get(`/api/v1/telemetry/${deviceA}`)
                .set('Authorization', `Bearer ${tokenA}`);

            // Assert
            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(3);
            expect(response.body[0]).toHaveProperty('value');
            expect(response.body[0]).toHaveProperty('timestamp');
            expect(response.body[0]).toHaveProperty('deviceId', deviceA);
        });

        it('deve retornar lista vazia quando não há sensor readings', async () => {
            // Arrange: Criar Tenant A e um device (sem sensor readings)
            await createTenant('TENANT_A', '123123');
            const { token: tokenA } = await loginTenant('TENANT_A', '123123');
            const { id: deviceA } = await createDevice(tokenA, 'Device A1');

            // Act: Listar sensor readings (não há nenhum)
            const response = await request(app)
                .get(`/api/v1/telemetry/${deviceA}`)
                .set('Authorization', `Bearer ${tokenA}`);

            // Assert
            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(0);
        });

        it('deve bloquear Tenant A de listar sensor readings do Tenant B', async () => {
            // Arrange: Criar dois tenants
            await createTenant('TENANT_A', '123123');
            await createTenant('TENANT_B', '456456');

            const { token: tokenA } = await loginTenant('TENANT_A', '123123');
            const { token: tokenB } = await loginTenant('TENANT_B', '456456');

            // Criar device e sensor readings para Tenant B
            const { id: deviceB } = await createDevice(tokenB, 'Device B1');
            await createSensorReading(tokenB, deviceB, 99.9);

            // Act: Tenant A tenta listar readings do Device B
            const response = await request(app)
                .get(`/api/v1/telemetry/${deviceB}`)
                .set('Authorization', `Bearer ${tokenA}`);

            // Assert: Deve retornar erro 403 (Forbidden)
            expect(response.status).toBe(403);
            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toContain('Device not found');
        });

        it('deve retornar erro quando tentar acessar sem token', async () => {
            // Act: Tentar acessar sem autenticação
            const response = await request(app).get(
                '/api/v1/telemetry/fake-device-id',
            );

            // Assert
            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('message');
        });
    });

    describe('POST /api/v1/telemetry - Criar sensor reading', () => {
        it('deve permitir que Tenant A crie sensor reading para seu próprio device', async () => {
            // Arrange
            await createTenant('TENANT_A', '123123');
            const { token: tokenA, tenantId } = await loginTenant(
                'TENANT_A',
                '123123',
            );
            const { id: deviceA } = await createDevice(tokenA, 'Device A1');

            // Act: Criar sensor reading
            const response = await request(app)
                .post('/api/v1/telemetry')
                .set('Authorization', `Bearer ${tokenA}`)
                .send({ deviceId: deviceA, value: 42.5 });

            // Assert
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('id');
            expect(response.body).toHaveProperty('deviceId', deviceA);
            expect(response.body).toHaveProperty('tenantId', tenantId);
            expect(response.body).toHaveProperty('value', 42.5);
            expect(response.body).toHaveProperty('timestamp');
        });

        it('deve bloquear Tenant A de criar sensor reading para device do Tenant B', async () => {
            // Arrange: Criar dois tenants
            await createTenant('TENANT_A', '123123');
            await createTenant('TENANT_B', '456456');

            const { token: tokenA } = await loginTenant('TENANT_A', '123123');
            const { token: tokenB } = await loginTenant('TENANT_B', '456456');

            // Criar device para Tenant B
            const { id: deviceB } = await createDevice(tokenB, 'Device B1');

            // Act: Tenant A tenta criar sensor reading para device do Tenant B
            const response = await request(app)
                .post('/api/v1/telemetry')
                .set('Authorization', `Bearer ${tokenA}`)
                .send({ deviceId: deviceB, value: 99.9 });

            // Assert: Deve ser bloqueado (403)
            expect(response.status).toBe(403);
            expect(response.body.message).toContain(
                'Device not found or does not belong to your tenant',
            );
        });

        it('deve retornar erro quando deviceId não existe', async () => {
            // Arrange
            await createTenant('TENANT_A', '123123');
            const { token: tokenA } = await loginTenant('TENANT_A', '123123');

            // Act: Tentar criar sensor reading para device inexistente
            const response = await request(app)
                .post('/api/v1/telemetry')
                .set('Authorization', `Bearer ${tokenA}`)
                .send({
                    deviceId: '00000000-0000-0000-0000-000000000000',
                    value: 25.5,
                });

            // Assert
            expect(response.status).toBe(403);
            expect(response.body.message).toContain('Device not found');
        });
    });

    describe('GET /api/v1/device - Listar devices', () => {
        it('deve retornar apenas devices do tenant autenticado', async () => {
            // Arrange: Criar dois tenants com devices
            await createTenant('TENANT_A', '123123');
            await createTenant('TENANT_B', '456456');

            const { token: tokenA, tenantId: tenantIdA } = await loginTenant(
                'TENANT_A',
                '123123',
            );
            const { token: tokenB } = await loginTenant('TENANT_B', '456456');

            // Criar devices para cada tenant
            await createDevice(tokenA, 'Device A1');
            await createDevice(tokenA, 'Device A2');
            await createDevice(tokenB, 'Device B1');

            // Act: Tenant A lista seus devices
            const response = await request(app)
                .get('/api/v1/device')
                .set('Authorization', `Bearer ${tokenA}`);

            // Assert: Deve retornar apenas devices do Tenant A
            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(2);
            expect(
                response.body.every(
                    (device: any) => device.tenantId === tenantIdA,
                ),
            ).toBe(true);
        });
    });
});
