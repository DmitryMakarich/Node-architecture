import { UserModel } from '@prisma/client';
import { User } from '../user.entity';
import { IUsersRepository } from './users.repository.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../types';
import { PrismaService } from '../../database/prisma.serivce';

@injectable()
export class UsersRepository implements IUsersRepository {
	constructor(@inject(TYPES.PrismaService) private prismaService: PrismaService) {}

	async create({ email, name, password }: User): Promise<UserModel> {
		return this.prismaService.client.userModel.create({
			data: {
				email,
				name,
				password,
			},
		});
	}

	async find(email: string): Promise<UserModel | null> {
		return this.prismaService.client.userModel.findFirst({
			where: {
				email,
			},
		});
	}
}
