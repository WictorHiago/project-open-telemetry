import { inject, injectable } from 'tsyringe';
import { ITenantRepository } from '../../../domain/telemetry/repositories/ITenantRepository';
import LoginDTO from '../../dtos/login/LoginDTO';
import LoginResponseDTO from '../../dtos/login/LoginResponseDTO';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

@injectable()
export default class LoginUseCase {
    constructor(
        @inject('TenantRepository')
        private tenantRepository: ITenantRepository,
    ) {}

    async execute(loginDTO: LoginDTO): Promise<LoginResponseDTO> {
        const tenant = await this.tenantRepository.findByUsername(
            loginDTO.username,
        );

        if (!tenant) {
            throw new Error('Tenant not found');
        }

        const isPasswordValid = await bcrypt.compare(
            loginDTO.password,
            tenant.password,
        );

        if (!isPasswordValid) {
            throw new Error('Invalid password');
        }

        const secretKey = process.env.SECRET_KEY!;
        const expiresIn = process.env.TOKEN_EXPIRATION!;

        const token = jwt.sign(
            { tenantId: tenant.id, username: tenant.username },
            secretKey,
            { expiresIn: '3m' },
        );

        return {
            token,
            tenantId: tenant.id,
            username: tenant.username,
        };
    }
}
