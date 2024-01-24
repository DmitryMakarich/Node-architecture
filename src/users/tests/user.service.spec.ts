import 'reflect-metadata';
import { Container } from 'inversify';
import { IConfigService } from '../../config/config.service.interface';
import { IUsersRepository } from '../repository/users.repository.interface';
import { IUserService } from '../service/user.service.interface';
import { TYPES } from '../../types';
import { UserService } from '../service/users.service';
import { User } from '../user.entity';
import { UserModel } from '@prisma/client';

const ConfigServiceMock: IConfigService = {
	get: jest.fn(),
};

const UsersRepositoryMock: IUsersRepository = {
	find: jest.fn(),
	create: jest.fn(),
};

const container = new Container();
let configService: IConfigService;
let usersRepository: IUsersRepository;
let userService: IUserService;

beforeAll(() => {
	container.bind<IUserService>(TYPES.UserService).to(UserService);
	container.bind<IConfigService>(TYPES.ConfigService).toConstantValue(ConfigServiceMock);
	container.bind<IUsersRepository>(TYPES.UserRepository).toConstantValue(UsersRepositoryMock);

	configService = container.get<IConfigService>(TYPES.ConfigService);
	usersRepository = container.get<IUsersRepository>(TYPES.UserRepository);
	userService = container.get<IUserService>(TYPES.UserService);
});

let createdUser: UserModel | null;

describe('User Service', () => {
	it('create user', async () => {
		configService.get = jest.fn().mockReturnValueOnce('1');
		usersRepository.create = jest.fn().mockImplementationOnce(
			(user: User): UserModel => ({
				id: 1,
				name: user.name,
				email: user.email,
				password: user.password,
			}),
		);

		createdUser = await userService.createUser({
			email: 'a@a.ru',
			name: 'name',
			password: '1234',
		});

		expect(createdUser?.id).toEqual(1);
		expect(createdUser?.password).not.toEqual('1');
	});

	describe('validate user', () => {
		beforeEach(() => {
			usersRepository.find = jest.fn().mockReturnValueOnce(createdUser);
		});

		it("user doesn't exist", async () => {
			const validate = await userService.validateUser({
				name: 'name',
				email: 'new@mail.ru',
				password: '123',
			});

			expect(validate).toBeFalsy();
		});

		it('wrong password', async () => {
			const validate = await userService.validateUser({
				name: 'name',
				email: 'a@a.ru',
				password: '123',
			});

			expect(validate).toBeFalsy();
		});

		it('correct user credentials', async () => {
			const validate = await userService.validateUser({
				name: 'name',
				email: 'a@a.ru',
				password: '1234',
			});

			expect(validate).toBeTruthy();
		});
	});
});
