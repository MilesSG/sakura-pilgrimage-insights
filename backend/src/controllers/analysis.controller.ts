import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common';
import { AnalysisService } from '../services/analysis.service';

@Controller('analysis')
export class AnalysisController {
  constructor(private readonly analysisService: AnalysisService) {}

  @Get('factors')
  async getInfluenceFactors() {
    return this.analysisService.getInfluenceFactors();
  }

  @Get('trends')
  async getTrends(
    @Query('anime') anime?: string,
    @Query('timeframe') timeframe: 'month' | 'year' = 'month'
  ) {
    return this.analysisService.getTrends(anime, timeframe);
  }

  @Post('tasks')
  async runAnalysisTask(
    @Body() taskRequest: { 
      taskId: string; 
      parameters?: Record<string, any>;
    }
  ) {
    return this.analysisService.runAnalysisTask(
      taskRequest.taskId, 
      taskRequest.parameters
    );
  }

  @Get('tasks')
  async getAvailableTasks() {
    return this.analysisService.getAvailableTasks();
  }

  @Get('tasks/:id')
  async getTaskStatus(@Param('id') taskId: string) {
    return this.analysisService.getTaskStatus(taskId);
  }

  @Get('sentiment')
  async getSentimentAnalysis(@Query('anime') anime?: string) {
    return this.analysisService.getSentimentAnalysis(anime);
  }
} 