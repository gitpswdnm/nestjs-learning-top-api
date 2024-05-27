import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Post,
	UsePipes,
	ValidationPipe,
	Headers,
	Query,
	Param,
	NotFoundException,
	UseGuards,
} from '@nestjs/common';
import { ALREADY_REGISTERED_ERROR, ID_USER_NOT_FOUND_ERROR } from './auth.constants';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import type { DocumentType } from '@typegoose/typegoose/lib/types';
import type { UserModel } from './user.model';
import { IdValidationPipe } from 'src/pipes/id-validation.pipe';
import { JwtAuthGuard } from './guards/jwt.guard';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}
	@UsePipes(new ValidationPipe())
	@Post('register')
	async register(@Body() dto: AuthDto) {
		const oldUser = await this.authService.findUserByEmail(dto.email);
		if (oldUser) {
			throw new BadRequestException(ALREADY_REGISTERED_ERROR);
		}
		return this.authService.createUser(dto);
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('login')
	async login(@Body() dto: AuthDto): Promise<{ access_token: string }> {
		const { email } = await this.authService.validateUser(dto);
		return this.authService.login(email);
	}

	@UseGuards(new JwtAuthGuard())
	@Get('user/:id')
	async getUser(
		@Param('id', IdValidationPipe) id: string,
	): Promise<DocumentType<UserModel>> {
		const user = await this.authService.findUserById(id);
		if (!user) {
			throw new NotFoundException(ID_USER_NOT_FOUND_ERROR);
		}
		return user;
	}

	@UseGuards(new JwtAuthGuard())
	@Delete('user/:id')
	async deleteUser(@Param('id', IdValidationPipe) id: string): Promise<void> {
		const deletedUser = await this.authService.deleteUser(id);
		if (!deletedUser) {
			throw new NotFoundException(ID_USER_NOT_FOUND_ERROR);
		}
	}
}
