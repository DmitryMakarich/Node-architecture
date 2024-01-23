import { PrismaClient, UserModel } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { ILogger } from '../logger/logger.interface';

@injectable()
export class PrismaService {
	client: PrismaClient;

	constructor(@inject(TYPES.ILogger) private logger: ILogger) {
		this.client = new PrismaClient();
	}

	async connect(): Promise<void> {
		try {
		} catch (err) {
			if (err instanceof Error) {
				this.logger.error('[PrismaService] Error due db connection' + err.message);
			}
		}
		await this.client.$connect();
		this.logger.log('[PrismaService] Successfully connected');
	}

	async disconnect(): Promise<void> {
		await this.client.$disconnect();
	}
}
