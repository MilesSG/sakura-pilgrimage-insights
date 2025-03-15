import { Injectable } from '@nestjs/common';
import { 
  InfluenceFactor, 
  AnalysisTask, 
  TrendData, 
  TaskStatus, 
  SentimentItem 
} from '../models/analysis-data.model';

@Injectable()
export class AnalysisService {
  // 影响因素数据
  private readonly influenceFactors: InfluenceFactor[] = [
    {
      name: '原作人气',
      value: 0.92,
      description: '原作动漫/漫画的人气程度对圣地巡礼热度有直接影响',
      trend: 'up',
      keywords: ['新作品', '续作', '经典', '销量', '口碑']
    },
    {
      name: '场景还原度',
      value: 0.85,
      description: '动漫场景与现实地点的相似程度',
      trend: 'stable',
      keywords: ['相似', '一致', '还原', '参考', '取景']
    },
    {
      name: '交通便利性',
      value: 0.72,
      description: '前往圣地的交通便利程度',
      trend: 'up',
      keywords: ['车站', '公交', '机场', '交通', '路线']
    },
    {
      name: '社交媒体曝光',
      value: 0.89,
      description: '在社交媒体上的讨论热度和曝光率',
      trend: 'up',
      keywords: ['分享', '讨论', '热搜', '话题', '推荐']
    },
    {
      name: '周边旅游资源',
      value: 0.65,
      description: '圣地周边的其他旅游景点和资源',
      trend: 'stable',
      keywords: ['景点', '酒店', '美食', '购物', '文化']
    },
    {
      name: '官方推广力度',
      value: 0.78,
      description: '当地政府或企业对动漫圣地的推广力度',
      trend: 'up',
      keywords: ['活动', '宣传', '合作', '周边', '节日']
    },
    {
      name: '粉丝社区活跃度',
      value: 0.83,
      description: '动漫粉丝社区的活跃程度和组织能力',
      trend: 'up',
      keywords: ['社区', '讨论', '组织', '活动', '应援']
    },
    {
      name: '季节性因素',
      value: 0.58,
      description: '季节变化对访问热度的影响',
      trend: 'down',
      keywords: ['季节', '假期', '节日', '天气', '樱花']
    }
  ];

  // 趋势数据
  private readonly trendData: Record<string, TrendData> = {
    month: {
      dates: ['2023-01', '2023-02', '2023-03', '2023-04', '2023-05', '2023-06', 
              '2023-07', '2023-08', '2023-09', '2023-10', '2023-11', '2023-12'],
      series: [
        {
          name: '灌篮高手',
          data: [120, 132, 101, 134, 190, 230, 410, 720, 500, 444, 390, 340]
        },
        {
          name: '你的名字',
          data: [220, 182, 191, 234, 290, 330, 310, 302, 341, 374, 390, 450]
        },
        {
          name: '名侦探柯南',
          data: [150, 232, 201, 154, 190, 330, 410, 400, 450, 420, 390, 350]
        },
        {
          name: '千与千寻',
          data: [320, 332, 301, 334, 350, 330, 320, 315, 310, 330, 350, 340]
        },
        {
          name: '少女与战车',
          data: [80, 90, 101, 104, 190, 230, 210, 240, 200, 230, 240, 250]
        }
      ]
    },
    year: {
      dates: ['2018', '2019', '2020', '2021', '2022', '2023'],
      series: [
        {
          name: '灌篮高手',
          data: [850, 920, 780, 930, 1450, 3320]
        },
        {
          name: '你的名字',
          data: [2800, 2500, 1820, 2340, 2900, 3320]
        },
        {
          name: '名侦探柯南',
          data: [1700, 1900, 1700, 2100, 2600, 3200]
        },
        {
          name: '千与千寻',
          data: [3400, 3200, 2900, 3100, 3300, 3500]
        },
        {
          name: '少女与战车',
          data: [950, 1100, 1250, 1350, 1700, 1920]
        }
      ]
    }
  };

  // 情感分析数据
  private readonly sentimentData: {
    overall: SentimentItem[];
    byAnime: Record<string, SentimentItem[]>;
  } = {
    overall: [
      { name: '正面', value: 60, color: '#39FF14' },
      { name: '中性', value: 30, color: '#00FFFF' },
      { name: '负面', value: 10, color: '#FF00FF' }
    ],
    byAnime: {
      '灌篮高手': [
        { name: '正面', value: 75, color: '#39FF14' },
        { name: '中性', value: 20, color: '#00FFFF' },
        { name: '负面', value: 5, color: '#FF00FF' }
      ],
      '你的名字': [
        { name: '正面', value: 80, color: '#39FF14' },
        { name: '中性', value: 15, color: '#00FFFF' },
        { name: '负面', value: 5, color: '#FF00FF' }
      ],
      '名侦探柯南': [
        { name: '正面', value: 65, color: '#39FF14' },
        { name: '中性', value: 25, color: '#00FFFF' },
        { name: '负面', value: 10, color: '#FF00FF' }
      ],
      '千与千寻': [
        { name: '正面', value: 85, color: '#39FF14' },
        { name: '中性', value: 12, color: '#00FFFF' },
        { name: '负面', value: 3, color: '#FF00FF' }
      ],
      '少女与战车': [
        { name: '正面', value: 70, color: '#39FF14' },
        { name: '中性', value: 20, color: '#00FFFF' },
        { name: '负面', value: 10, color: '#FF00FF' }
      ]
    }
  };

  // 分析任务
  private readonly availableTasks: AnalysisTask[] = [
    {
      id: 'factor-analysis',
      name: '影响因素分析',
      description: '分析影响动漫圣地巡礼热度的关键因素及其权重'
    },
    {
      id: 'sentiment-correlation',
      name: '情感相关性分析',
      description: '分析社交媒体上的情感表达与圣地访问热度的相关性'
    },
    {
      id: 'time-series',
      name: '时间序列预测',
      description: '基于历史数据预测未来6个月的圣地访问热度趋势'
    },
    {
      id: 'location-clustering',
      name: '地理位置聚类',
      description: '对圣地位置进行聚类分析，发现地理分布规律'
    }
  ];

  // 任务状态记录
  private taskStatus: Record<string, TaskStatus> = {};

  async getInfluenceFactors(): Promise<InfluenceFactor[]> {
    return this.influenceFactors;
  }

  async getTrends(anime?: string, timeframe: 'month' | 'year' = 'month'): Promise<TrendData> {
    const data = this.trendData[timeframe];
    
    if (anime) {
      const series = data.series.filter(s => s.name === anime);
      return {
        dates: data.dates,
        series
      };
    }
    
    return data;
  }

  async runAnalysisTask(
    taskId: string, 
    parameters?: Record<string, any>
  ) {
    const task = this.availableTasks.find(t => t.id === taskId);
    
    if (!task) {
      throw new Error(`未找到ID为 ${taskId} 的分析任务`);
    }
    
    // 创建唯一的任务实例ID
    const instanceId = `${taskId}-${Date.now()}`;
    
    // 记录任务状态
    this.taskStatus[instanceId] = {
      id: instanceId,
      taskId,
      status: 'running',
      progress: 0,
      startTime: new Date().toISOString(),
      parameters
    };
    
    // 在实际应用中，这里应该启动一个异步的分析任务
    // 这里我们只是模拟任务立即完成
    setTimeout(() => {
      this.taskStatus[instanceId] = {
        ...this.taskStatus[instanceId],
        status: 'completed',
        progress: 100,
        endTime: new Date().toISOString(),
        result: this.getTaskResult(taskId, parameters)
      };
    }, 100);
    
    return {
      instanceId,
      message: `任务 ${task.name} 已启动`,
      status: 'running'
    };
  }

  async getAvailableTasks(): Promise<AnalysisTask[]> {
    return this.availableTasks;
  }

  async getTaskStatus(instanceId: string): Promise<TaskStatus> {
    const status = this.taskStatus[instanceId];
    
    if (!status) {
      throw new Error(`未找到ID为 ${instanceId} 的任务实例`);
    }
    
    return status;
  }

  async getSentimentAnalysis(anime?: string) {
    if (anime && this.sentimentData.byAnime[anime]) {
      return {
        anime,
        data: this.sentimentData.byAnime[anime]
      };
    }
    
    return {
      anime: 'overall',
      data: this.sentimentData.overall
    };
  }

  // 根据任务类型返回对应的结果数据
  private getTaskResult(taskId: string, parameters?: Record<string, any>) {
    switch (taskId) {
      case 'factor-analysis':
        return this.influenceFactors;
        
      case 'sentiment-correlation':
        return {
          correlation: 0.78,
          factors: [
            { sentiment: 'positive', correlation: 0.85 },
            { sentiment: 'neutral', correlation: 0.32 },
            { sentiment: 'negative', correlation: -0.45 }
          ],
          analysis: '正面情感与访问热度呈强正相关，负面情感与访问热度呈中等负相关'
        };
        
      case 'time-series':
        // 根据参数生成预测数据
        const anime = parameters?.anime || '灌篮高手';
        return {
          anime,
          dates: ['2024-01', '2024-02', '2024-03', '2024-04', '2024-05', '2024-06'],
          values: [350, 370, 390, 420, 480, 510],
          confidence: [
            [320, 380],
            [330, 410],
            [340, 440],
            [360, 480],
            [410, 550],
            [430, 590]
          ]
        };
        
      case 'location-clustering':
        return {
          clusters: [
            {
              name: '东京都市圈',
              center: [35.6895, 139.6917],
              count: 12,
              radius: 50
            },
            {
              name: '京都-大阪文化圈',
              center: [34.9854, 135.7589],
              count: 8,
              radius: 30
            },
            {
              name: '北海道自然区',
              center: [43.2203, 142.8635],
              count: 5,
              radius: 80
            }
          ],
          analysis: '动漫圣地主要集中在三大地理区域，东京都市圈占比最高'
        };
        
      default:
        return null;
    }
  }
} 