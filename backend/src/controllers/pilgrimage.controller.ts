import { Controller, Get, Param, Query, Post, Body } from '@nestjs/common';
import { PilgrimageService } from '../services/pilgrimage.service';
import { PilgrimageSpot } from '../models/pilgrimage-spot.model';

@Controller('pilgrimage')
export class PilgrimageController {
  constructor(private readonly pilgrimageService: PilgrimageService) {}

  @Get('spots')
  async getAllSpots(@Query('anime') anime?: string): Promise<PilgrimageSpot[]> {
    if (anime) {
      return this.pilgrimageService.getSpotsByAnime(anime);
    }
    return this.pilgrimageService.getAllSpots();
  }

  @Get('spots/:id')
  async getSpotById(@Param('id') id: string): Promise<PilgrimageSpot> {
    return this.pilgrimageService.getSpotById(Number(id));
  }

  @Get('popular')
  async getPopularSpots(@Query('limit') limit = 5): Promise<PilgrimageSpot[]> {
    return this.pilgrimageService.getPopularSpots(Number(limit));
  }

  @Get('stats')
  async getStatistics() {
    return this.pilgrimageService.getStatistics();
  }
} 