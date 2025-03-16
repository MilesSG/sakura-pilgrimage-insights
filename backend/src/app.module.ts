import { Module } from '@nestjs/common';
import { PilgrimageController } from './controllers/pilgrimage.controller';
import { PilgrimageService } from './services/pilgrimage.service';
import { CrawlerController } from './controllers/crawler.controller';
import { CrawlerService } from './services/crawler.service';
import { AnalysisController } from './controllers/analysis.controller';
import { AnalysisService } from './services/analysis.service';

@Module({
  imports: [],
  controllers: [
    PilgrimageController,
    CrawlerController,
    AnalysisController,
  ],
  providers: [
    PilgrimageService,
    CrawlerService,
    AnalysisService,
  ],
})
export class AppModule {} 