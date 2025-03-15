export interface InfluenceFactor {
  name: string;
  value: number;
  description: string;
  trend: 'up' | 'down' | 'stable';
  keywords: string[];
}

export interface TrendData {
  dates: string[];
  series: {
    name: string;
    data: number[];
  }[];
}

export interface SentimentItem {
  name: string;
  value: number;
  color: string;
}

export interface AnalysisTask {
  id: string;
  name: string;
  description: string;
  parameters?: Record<string, any>;
}

export interface TaskStatus {
  id: string;
  taskId: string;
  status: 'queued' | 'running' | 'completed' | 'error';
  progress: number;
  startTime: string;
  endTime?: string;
  parameters?: Record<string, any>;
  result?: any;
  error?: string;
} 