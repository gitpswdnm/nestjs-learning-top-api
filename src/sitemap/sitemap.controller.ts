import { Controller, Get, Header } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DateTime } from 'luxon';
import { TopPageService } from 'src/top-page/top-page.service';
import { Builder } from 'xml2js';
import { CATEGORY_URL } from './sitemap.constants';

@Controller('sitemap')
export class SitemapController {
	domain: string;
	constructor(
		private readonly topPageService: TopPageService,
		private readonly configService: ConfigService,
	) {
		this.domain = configService.get('DOMAIN') ?? '';
	}
	@Get('xml')
	@Header('content-type', 'text/xml')
	async siteMap() {
		let res = [
			{
				loc: this.domain,
				lastmod: DateTime.now().minus({ days: 1 }).toISO(),
				changefreq: 'daily',
				priority: '1.0',
			},
			{
				loc: `${this.domain}/courses`,
				lastmod: DateTime.now().minus({ days: 1 }).toISO(),
				changefreq: 'daily',
				priority: '1.0',
			},
		];
		const pages = await this.topPageService.findAll();
		res = res.concat(
			pages.map((page) => {
				return {
					loc: `${this.domain}${CATEGORY_URL[page.firstCategory]}/${page.alias}`,
					lastmod:
						DateTime.fromISO(page.updatedAt.toISOString()).toISO() ??
						DateTime.now().minus({ days: 1 }).toISO(),
					changefreq: 'weakly',
					priority: '0.7',
				};
			}),
		);
		const builder = new Builder({
			xmldec: { version: '1.0', encoding: 'UTF-8' },
		});

		return builder.buildObject({
			urlset: {
				$: {
					xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9',
				},
				url: res,
			},
		});
	}
}
