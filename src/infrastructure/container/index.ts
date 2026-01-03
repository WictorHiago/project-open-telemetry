import "reflect-metadata";
import { container } from "tsyringe";
import { IDeviceRepository } from "../../domain/telemetry/repositories/IDeviceRepository";
import { DeviceRepository } from "../repositories/DeviceRepository";

container.registerSingleton<IDeviceRepository>("DeviceRepository", DeviceRepository)