export class MFIle {
	originalname: string;
	buffer: Buffer;

	constructor(file: Express.Multer.File | MFIle) {
		this.buffer = file.buffer;
		this.originalname = file.originalname;
	}
}
