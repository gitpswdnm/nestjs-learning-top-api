import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import type { ProductModel } from 'src/product/product.model';

@Controller('review')
export class ReviewController {
	@Post('create')
	async create(@Body() dto: Omit<ProductModel, '_id'>): Promise<void> {}

	@Delete(':id')
	async delete(@Param('id') id: string): Promise<void> {}

	@Get('byProduct/:productId')
	async getByProduct(@Param('productId') productId: string): Promise<void> {}
}
