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
} from '@nestjs/common';
import { ALREADY_REGISTERED_ERROR } from './auth.constants';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}
	@UsePipes(new ValidationPipe())
	@Post('register')
	async register(@Body() dto: AuthDto) {
		const oldUser = await this.authService.findUser(dto.email);
		if (oldUser) {
			throw new BadRequestException(ALREADY_REGISTERED_ERROR);
		}
		return this.authService.createUser(dto);
	}

	@Get('user')
	async getUser(@Headers('email') email: string) {
		return this.authService.findUser(email);
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('login')
	async login(@Body() dto: AuthDto): Promise<{ access_token: string }> {
		const { email } = await this.authService.validateUser(dto);
		return this.authService.login(email);
	}

	@Delete('deleteUser')
	async deleteUser(@Query('email') email: string) {
		return this.authService.deleteUser(email);
	}
}
