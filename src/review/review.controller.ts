import {
	Body,
	Controller,
	Delete,
	Get,
	HttpException,
	HttpStatus,
	Param,
	Post,
	UseGuards,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import type { DocumentType } from '@typegoose/typegoose/lib/types';
import { CreateReviewDto } from './dto/create-review.dto';
import { REVIEW_NOT_FOUND } from './review.constants';
import type { ReviewModel } from './review.model';
import { ReviewService } from './review.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UserEmail } from 'src/decorators/user-email.decorator';
import { IdValidationPipe } from 'src/pipes/id-validation.pipe';

@Controller('review')
export class ReviewController {
	constructor(private readonly reviewService: ReviewService) {}

	@UsePipes(new ValidationPipe())
	@Post('create')
	async create(@Body() dto: CreateReviewDto): Promise<DocumentType<ReviewModel>> {
		return this.reviewService.create(dto);
	}

	@UseGuards(JwtAuthGuard)
	@Delete(':id')
	async delete(
		@Param('id', IdValidationPipe) id: string,
	): Promise<DocumentType<ReviewModel>> {
		const deletedDoc = await this.reviewService.delete(id);
		if (!deletedDoc) {
			throw new HttpException(REVIEW_NOT_FOUND, HttpStatus.NOT_FOUND);
		}
		return deletedDoc;
	}

	// @UseGuards(JwtAuthGuard)
	@Get('byProduct/:productId')
	async getByProduct(
		@Param('productId', IdValidationPipe) productId: string,
		@UserEmail() email: string,
	): Promise<DocumentType<ReviewModel>[]> {
		return this.reviewService.findByProductId(productId);
	}
}
