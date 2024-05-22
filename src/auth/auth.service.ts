import { Inject, Injectable } from '@nestjs/common';
import type { AuthDto } from './dto/auth.dto';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { UserModel } from './user.model';

@Injectable()
export class AuthService {
	constructor(@Inject(UserModel) private readonly userModel: ModelType<UserModel>) {}

	async createUser(dto: AuthDto) {}

	async findUser(email: string) {}
}
