import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { DocumentType } from '@typegoose/typegoose/lib/types';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { compare, genSalt, hash } from 'bcryptjs';
import { InjectModel } from 'nestjs-typegoose';
import { USER_NOT_FOUND_ERROR, WRONG_PASSWORD_ERROR } from './auth.constants';
import type { AuthDto } from './dto/auth.dto';
import { UserModel } from './user.model';

@Injectable()
export class AuthService {
	constructor(
		@InjectModel(UserModel) private readonly userModel: ModelType<UserModel>,
		private readonly jwtService: JwtService,
	) {}

	async createUser(dto: AuthDto): Promise<DocumentType<UserModel>> {
		const salt = await genSalt(10);
		const newUser = new this.userModel({
			email: dto.email,
			passwordHash: await hash(dto.password, salt),
		});
		return newUser.save();
	}

	async findUserByEmail(email: string): Promise<DocumentType<UserModel>> {
		return await this.userModel.findOne({ email: email }).exec();
	}

	async findUserById(id: string): Promise<DocumentType<UserModel>> {
		return await this.userModel.findById(id).exec();
	}

	async validateUser(dto: AuthDto): Promise<Pick<UserModel, 'email'>> {
		const user = await this.findUserByEmail(dto.email);
		if (!user) {
			throw new UnauthorizedException(USER_NOT_FOUND_ERROR);
		}
		const isCorrectPassword = await compare(dto.password, user.passwordHash);
		if (!isCorrectPassword) {
			throw new UnauthorizedException(WRONG_PASSWORD_ERROR);
		}
		return { email: user.email };
	}

	async login(email: string): Promise<{ access_token: string }> {
		const payload = { email };
		return {
			access_token: await this.jwtService.signAsync(payload /* , { expiresIn: '10m' } */),
		};
	}

	async deleteUser(id: string): Promise<DocumentType<UserModel>> {
		return this.userModel.findByIdAndDelete(id).exec();
	}
}
