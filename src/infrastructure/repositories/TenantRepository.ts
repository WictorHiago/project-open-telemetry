import { injectable } from "tsyringe";
import { ITenantRepository } from "../../domain/telemetry/repositories/ITenantRepository";
import { tenants } from "../database/drizzle/schemas/schema";
import { db } from "../database/drizzle/datasource";
import { desc, eq } from 'drizzle-orm';
import Tenant from '../../domain/telemetry/entities/Tenant';

@injectable()
export class TenantRepository implements ITenantRepository {
    async create(tenant: Tenant): Promise<Tenant> {
        const database = await db;

        const createdTenant = await database
            .insert(tenants)
            .values({
                id: tenant.id,
                username: tenant.username,
                password: tenant.password,
            })
            .returning();

        return createdTenant[0];
    }

    async findById(tenantId: string): Promise<Tenant | null> {
        const database = await db;

        const tenant = await database
            .select()
            .from(tenants)
            .where(eq(tenants.id, tenantId));

        return tenant[0] ?? null;
    }

    async findByUsername(username: string): Promise<Tenant | null> {
        const database = await db;

        const tenant = await database
            .select()
            .from(tenants)
            .where(eq(tenants.username, username));

        return tenant[0] ?? null;
    }

    async findAll(): Promise<Tenant[]> {
        const database = await db;

        const tenantList = await database
            .select()
            .from(tenants)
            .orderBy(desc(tenants.createdAt));

        return tenantList.map((tenant) =>
            Tenant.create(tenant.id, tenant.username, tenant.password),
        ) as Tenant[];
    }
}