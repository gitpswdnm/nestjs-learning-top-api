import {
	Controller,
	HttpCode,
	Post,
	UploadedFile,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import type { FileElementResponse } from './dto/file-element.response';
import { FilesService } from './files.service';
import { MFIle } from './dto/mfile.class';

@Controller('files')
export class FilesController {
	constructor(private readonly filesService: FilesService) {}
	@Post('upload')
	@HttpCode(200)
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(FileInterceptor('files'))
	async uploadFile(
		@UploadedFile() file: Express.Multer.File,
	): Promise<FileElementResponse[]> {
		const saveArray: MFIle[] = [new MFIle(file)];
		if (file.mimetype.includes('image')) {
			const splittedName = file.originalname.split('.');
			if (file.originalname.split('.')[splittedName.length - 1] !== 'webp') {
				const webP = await this.filesService.convertToWebP(file.buffer);
				saveArray.push(
					new MFIle({
						originalname: `${splittedName[0]}.webp`,
						buffer: webP,
					}),
				);
			}
		}
		return this.filesService.saveFiles(saveArray);
	}
}
