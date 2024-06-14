import { Injectable } from '@nestjs/common';
import { path } from 'app-root-path';
import { ensureDir, writeFile } from 'fs-extra';
import { DateTime } from 'luxon';
import * as sharp from 'sharp';
import type { FileElementResponse } from './dto/file-element.response';
import type { MFIle } from './dto/mfile.class';

@Injectable()
export class FilesService {
	async saveFiles(files: MFIle[]): Promise<FileElementResponse[]> {
		const dateFolder = DateTime.now().toISODate();
		const uploadFolder = `${path}/uploads/${dateFolder}`;
		await ensureDir(uploadFolder);
		const res: FileElementResponse[] = [];

		for (const file of files) {
			await writeFile(`${uploadFolder}/${file.originalname}`, file.buffer);
			res.push({ url: `${dateFolder}/${file.originalname}`, name: file.originalname });
		}

		return res;
	}

	convertToWebP(file: Buffer): Promise<Buffer> {
		return sharp(file).webp().toBuffer();
	}
}
