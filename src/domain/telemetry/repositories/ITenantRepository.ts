import Tenant from '../entities/Tenant';

export interface ITenantRepository {
    create(tenant: Tenant): Promise<Tenant>;
    findById(id: string): Promise<Tenant | null>;
    findByUsername(username: string): Promise<Tenant | null>;
    findAll(): Promise<Tenant[]>;
}
