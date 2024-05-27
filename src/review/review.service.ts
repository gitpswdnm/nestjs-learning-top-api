import { Injectable } from '@nestjs/common';
import type { DocumentType } from '@typegoose/typegoose/lib/types';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { Types } from 'mongoose';
import { InjectModel } from 'nestjs-typegoose';
import type { CreateReviewDto } from './dto/create-review.dto';
import { ReviewModel } from './review.model';
import type { DeleteResult } from 'src/common/types';

class Leak {}

const leaks = [];

@Injectable()
export class ReviewService {
	constructor(
		@InjectModel(ReviewModel) private readonly reviewModel: ModelType<ReviewModel>,
	) {}

	async create(dto: CreateReviewDto): Promise<DocumentType<ReviewModel>> {
		return this.reviewModel.create(dto);
	}

	async delete(id: string): Promise<DocumentType<ReviewModel> | null> {
		return this.reviewModel.findByIdAndDelete(id).exec();
	}

	async findByProductId(productId: string): Promise<DocumentType<ReviewModel>[]> {
		leaks.push(new Leak());
		return this.reviewModel.find({ productId: new Types.ObjectId(productId) }).exec();
	}

	async deleteByProductId(productId: string): Promise<DeleteResult> {
		return this.reviewModel
			.deleteMany({ productId: new Types.ObjectId(productId) })
			.exec();
	}
}
