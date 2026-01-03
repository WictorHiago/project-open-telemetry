import { inject, injectable } from 'tsyringe';
import { randomUUID } from 'crypto';
import { ITenantRepository } from '../../../domain/telemetry/repositories/ITenantRepository';
import Tenant from '../../../domain/telemetry/entities/Tenant';
import { CreateTenantRequestDTO } from '../../../presentation/http/dtos/tenant/CreateTenantRequestDTO';
import { CreateTenantResponseDTO } from '../../../presentation/http/dtos/tenant/CreateTenantResponseDTO';

@injectable()
export class CreateTenantUseCase {
    constructor(
        @inject('TenantRepository') private tenantRepository: ITenantRepository,
    ) {}

    async execute(
        payload: CreateTenantRequestDTO,
    ): Promise<CreateTenantResponseDTO> {
        const tenantExist = await this.tenantRepository.findByUsername(
            payload.username,
        );

        if (tenantExist) {
            throw new Error('Tenant already exists');
        }

        const tenant = Tenant.create(
            randomUUID(),
            payload.username,
            payload.password,
        );

        const createdTenant = await this.tenantRepository.create(tenant);

        return {
            id: createdTenant.id,
            username: createdTenant.username,
        };
    }
}
