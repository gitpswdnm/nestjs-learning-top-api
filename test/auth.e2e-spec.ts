import type { INestApplication } from '@nestjs/common';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { Types, disconnect } from 'mongoose';
import { USER_NOT_FOUND_ERROR, WRONG_PASSWORD_ERROR } from 'src/auth/auth.constants';
import type { AuthDto } from 'src/auth/dto/auth.dto';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

const authDto: AuthDto = {
	email: 'test@rr.ru',
	password: '1',
};

let app: INestApplication;

describe('AuthController (e2e)', () => {
	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();

		await request(app.getHttpServer()).post('/auth/register').send(authDto);
	});

	afterEach(async () => {
		await request(app.getHttpServer())
			.delete('/auth/deleteUser')
			.query({ email: authDto.email });
	});

	it('/auth/login (POST) - success', async () => {
		return request(app.getHttpServer())
			.post('/auth/login')
			.send(authDto)
			.expect(200)
			.then(({ body }: request.Response) => {
				expect(body.access_token).toBeDefined;
			});
	});
	it('/auth/login (POST) - fail wrong email', async () => {
		return request(app.getHttpServer())
			.post('/auth/login')
			.send({ ...authDto, email: 'aaaa@aaa.ru' })
			.expect(401, {
				statusCode: 401,
				message: USER_NOT_FOUND_ERROR,
				error: 'Unauthorized',
			});
	});

	it('/auth/login (POST) - fail wrong password', async () => {
		return request(app.getHttpServer())
			.post('/auth/login')
			.send({ ...authDto, password: 'sss' })
			.expect(401, {
				statusCode: 401,
				message: WRONG_PASSWORD_ERROR,
				error: 'Unauthorized',
			});
	});

	afterAll(() => {
		disconnect();
	});
});
