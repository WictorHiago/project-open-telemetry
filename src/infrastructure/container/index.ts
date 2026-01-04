import "reflect-metadata";
import { container } from "tsyringe";
import { IDeviceRepository } from "../../domain/telemetry/repositories/IDeviceRepository";
import { DeviceRepository } from "../repositories/DeviceRepository";
import { SensorReadingRepository } from '../repositories/SensorReadingRepository';
import { ISensorReadingRepository } from '../../domain/telemetry/repositories/ISensorReadingRepository';
import { ITenantRepository } from '../../domain/telemetry/repositories/ITenantRepository';
import { TenantRepository } from '../repositories/TenantRepository';
import LoginUseCase from '../../application/usecases/auth/LoginUseCase';

container.registerSingleton<LoginUseCase>('LoginUseCase', LoginUseCase);

container.registerSingleton<IDeviceRepository>(
    'DeviceRepository',
    DeviceRepository,
);

container.registerSingleton<ISensorReadingRepository>(
    'SensorReadingRepository',
    SensorReadingRepository,
);

container.registerSingleton<ITenantRepository>(
    'TenantRepository',
    TenantRepository,
);
