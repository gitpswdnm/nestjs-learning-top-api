import type { ConfigService } from '@nestjs/config';
import type { TypegooseModuleOptions } from 'nestjs-typegoose';

export const getMongoConfig = async (
	configService: ConfigService,
): Promise<TypegooseModuleOptions> => ({
	uri: getMongoString(configService),
	/* ...getMongoOptions(), */
});

const getMongoString = (configService: ConfigService): string =>
	'mongodb://' +
	configService.get('MONGO_LOGIN') +
	':' +
	configService.get('MONGO_PASSWORD') +
	'@' +
	configService.get('MONGO_HOST') +
	':' +
	configService.get('MONGO_PORT') +
	'/' +
	configService.get('MONGO_AUTHDATABASE');

// const getMongoOptions = (): { [key: string]: boolean } => ({
// 	useNewUrlParser: true,
// 	useCreateIndex: true,
// 	useUnifiedTopology: true,
// });
