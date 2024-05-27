import type { ConfigService } from '@nestjs/config';
import type { JwtModuleOptions } from '@nestjs/jwt';

export const getJWTConfig = async (
	configService: ConfigService,
): Promise<JwtModuleOptions> => {
	return {
		secret: configService.get('JWT_SECRET'),
	};
};
