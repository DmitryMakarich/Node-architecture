import request from 'supertest';
import { App } from '../src/app';
import { boot } from '../src/main';

let application: App;

beforeAll(async () => {
	const { app } = await boot;
	application = app;
});

describe('Users e2e', () => {
	it('Register - error', async () => {
		const res = await request(application.app)
			.post('/users/register')
			.send({ email: '1@mail.ru', password: '1234' });

		expect(res.statusCode).toBe(404);
	});

	it('Login - success', async () => {
		const res = await request(application.app)
			.post('/users/login')
			.send({ name: 'Petya', email: 'a2@mail.ru', password: '1234' });

		expect(res.body.jwt).not.toBeUndefined();
	});

	it('Login - error', async () => {
		const res = await request(application.app)
			.post('/users/login')
			.send({ name: 'Petya', email: 'a2@mail.ru', password: '123' });

		expect(res.statusCode).toBe(401);
	});

	it('Info - success', async () => {
		const login = await request(application.app)
			.post('/users/login')
			.send({ name: 'Petya', email: 'a2@mail.ru', password: '1234' });

		const res = await request(application.app)
			.get('/users/info')
			.set('Authorization', `Bearer ${login.body.jwt}`);

		expect(res.body.email).toBe('a2@mail.ru');
	});

	it('Info - error', async () => {
		const login = await request(application.app)
			.post('/users/login')
			.send({ name: 'Petya', email: 'a2@mail.ru', password: '1234' });

		const res = await request(application.app).get('/users/info').set('Authorization', `Bearer 1`);

		expect(res.statusCode).toBe(401);
	});
});

afterAll(() => {
	application.close();
});
