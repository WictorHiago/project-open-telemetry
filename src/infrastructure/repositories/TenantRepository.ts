import { injectable } from "tsyringe";
import { ITenantRepository } from "../../domain/telemetry/repositories/ITenantRepository";
import { tenants } from "../database/drizzle/schemas/schema";
import { db } from "../database/drizzle/datasource";
import { eq } from "drizzle-orm";

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
}