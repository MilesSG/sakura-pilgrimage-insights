import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { CrawlerService } from '../services/crawler.service';
import { SocialData } from '../models/social-data.model';

@Controller('crawler')
export class CrawlerController {
  constructor(private readonly crawlerService: CrawlerService) {}

  @Get('data')
  async getSocialData(
    @Query('platform') platform?: string,
    @Query('keyword') keyword?: string,
    @Query('limit') limit?: number
  ): Promise<SocialData[]> {
    return this.crawlerService.getSocialData(platform, keyword, limit);
  }

  @Post('crawl')
  async startCrawling(
    @Body() crawlRequest: { 
      platforms: string[]; 
      keyword: string;
    }
  ) {
    return this.crawlerService.startCrawling(
      crawlRequest.platforms, 
      crawlRequest.keyword
    );
  }

  @Get('platforms')
  async getSupportedPlatforms() {
    return this.crawlerService.getSupportedPlatforms();
  }

  @Get('stats')
  async getCrawlerStats() {
    return this.crawlerService.getCrawlerStats();
  }
} 