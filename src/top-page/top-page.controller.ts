import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	NotFoundException,
	Param,
	Patch,
	Post,
	UseGuards,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import type { DocumentType } from '@typegoose/typegoose/lib/types';
import { CreateTopPageDto } from './dto/create-top-page.dto';
import { FindTopPageDto } from './dto/find-top-page.dto';
import type { TopPageModel } from './top-page.model';
import { TopPageService } from './top-page.service';
import { IdValidationPipe } from 'src/pipes/id-validation.pipe';
import {
	ALIAS_MUST_BE_UNIQ_ERROR,
	CATEGORY_NOT_FOUND_ERROR,
	TOP_PAGE_NOT_FOND_ERROR,
} from './top-page.constants';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('top-page')
export class TopPageController {
	constructor(private readonly topPageService: TopPageService) {}

	@UseGuards(new JwtAuthGuard())
	@UsePipes(new ValidationPipe())
	@Post('create')
	async create(@Body() dto: CreateTopPageDto): Promise<DocumentType<TopPageModel>> {
		const isAliasUnique = await this.topPageService.findByAlias(dto.alias);
		if (isAliasUnique) {
			throw new BadRequestException(ALIAS_MUST_BE_UNIQ_ERROR);
		}
		return this.topPageService.create(dto);
	}

	@UseGuards(new JwtAuthGuard())
	@Get(':id')
	async get(
		@Param('id', IdValidationPipe) id: string,
	): Promise<DocumentType<TopPageModel>> {
		const page = await this.topPageService.findById(id);
		if (!page) {
			throw new NotFoundException(TOP_PAGE_NOT_FOND_ERROR);
		}
		return page;
	}

	@Get('byAlias/:alias')
	async getByAlias(@Param('alias') alias: string): Promise<DocumentType<TopPageModel>> {
		const page = await this.topPageService.findByAlias(alias);
		if (!page) {
			throw new NotFoundException(TOP_PAGE_NOT_FOND_ERROR);
		}
		return page;
	}

	@UseGuards(new JwtAuthGuard())
	@Delete(':id')
	async delete(@Param('id', IdValidationPipe) id: string): Promise<void> {
		const deletedPage = await this.topPageService.deleteById(id);
		if (!deletedPage) {
			throw new NotFoundException(TOP_PAGE_NOT_FOND_ERROR);
		}
	}

	@UseGuards(new JwtAuthGuard())
	@UsePipes(new ValidationPipe())
	@Patch(':id')
	async patch(
		@Param('id', IdValidationPipe) id: string,
		@Body() dto: CreateTopPageDto,
	): Promise<DocumentType<TopPageModel>> {
		const updatedPage = await this.topPageService.updateById(id, dto);
		if (!updatedPage) {
			throw new NotFoundException(TOP_PAGE_NOT_FOND_ERROR);
		}
		return updatedPage;
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('find')
	async find(
		@Body() { firstCategory }: FindTopPageDto,
	): Promise<DocumentType<Pick<TopPageModel, 'alias' | 'secondCategory' | 'title'>>[]> {
		const pages = await this.topPageService.findByCategory(firstCategory);
		if (!pages.length) {
			throw new NotFoundException(CATEGORY_NOT_FOUND_ERROR);
		}
		return pages;
	}
}
