import { Inject, Injectable } from '@nestjs/common';
import { Bot } from 'grammy';
import { TELEGRAM_MODULE_OPTIONS } from './telegram.constants';
import { ITelegramOptions } from './telegram.interface';

@Injectable()
export class TelegramService {
	bot: Bot;
	options: ITelegramOptions;
	constructor(@Inject(TELEGRAM_MODULE_OPTIONS) options: ITelegramOptions) {
		this.bot = new Bot(options.token);
		this.options = options;
	}

	async sendMessage(message: string, chatId: string = this.options.chatId) {
		await this.bot.api.sendMessage(chatId, message);
	}
}
