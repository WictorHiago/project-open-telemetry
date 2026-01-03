export interface ITenantRepository{
    // criar um novo tenant
    create(tenant: Tenant): Promise<Tenant>
    // buscar por id
    findById(id: string): Promise<Tenant | null>
    // buscar por username
    findByUsername(username: string): Promise<Tenant | null>
    // listar todos os tenants
    findAll(): Promise<Tenant[]>
}