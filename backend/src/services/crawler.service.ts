import { Injectable } from '@nestjs/common';
import { SocialData } from '../models/social-data.model';

@Injectable()
export class CrawlerService {
  private readonly mockSocialData: SocialData[] = [
    {
      id: '1',
      platform: '哔哩哔哩',
      content: '灌篮高手圣地巡礼VLOG，日本镰仓高校前，终于看到了湘北队训练的地方！',
      author: 'anime_traveler',
      likes: 2453,
      comments: 156,
      timestamp: '2023-11-15',
      sentiment: 'positive',
      relevance: 95,
      imageUrl: 'https://images.unsplash.com/photo-1622372738946-62e2aedf48f3?w=300'
    },
    {
      id: '2',
      platform: '小红书',
      content: '打卡《你的名字》圣地巡礼，须磨浦公园的风景真的和电影里一模一样！',
      author: 'travel_notes',
      likes: 1287,
      comments: 89,
      timestamp: '2023-12-02',
      sentiment: 'positive',
      relevance: 90,
      imageUrl: 'https://images.unsplash.com/photo-1574236170880-faf57f8d26ef?w=300'
    },
    {
      id: '3',
      platform: '微博',
      content: '柯南迷们注意了，东京塔现场直击，就是这个标志性建筑在剧场版中多次出现！',
      author: 'detective_otaku',
      likes: 876,
      comments: 64,
      timestamp: '2023-10-28',
      sentiment: 'positive',
      relevance: 85,
      imageUrl: 'https://images.unsplash.com/photo-1551641506-ee5bf4cb45f1?w=300'
    },
    {
      id: '4',
      platform: '哔哩哔哩',
      content: '姬路城参观体验，据说是《千与千寻》中汤屋的灵感来源，真的太美了！',
      author: 'ghibli_fan',
      likes: 1932,
      comments: 143,
      timestamp: '2023-09-18',
      sentiment: 'positive',
      relevance: 80,
      imageUrl: 'https://images.unsplash.com/photo-1590253230532-a67f6bc61c9e?w=300'
    },
    {
      id: '5',
      platform: '抖音',
      content: '少女与战车大洗町巡礼，简直动漫场景再现，商店街全是痛车和角色立牌！',
      author: 'anime_spot',
      likes: 3452,
      comments: 267,
      timestamp: '2023-11-25',
      sentiment: 'positive',
      relevance: 92,
      imageUrl: 'https://images.unsplash.com/photo-1613861614193-f7f245e61df2?w=300'
    },
    {
      id: '6',
      platform: '微博',
      content: '京都动画公司的作品《冰菓》真的在现实中存在！京都市内的场景完美再现！',
      author: 'kyoani_fan',
      likes: 1678,
      comments: 129,
      timestamp: '2023-08-12',
      sentiment: 'positive',
      relevance: 88,
      imageUrl: 'https://images.unsplash.com/photo-1576786230663-ebb0c6db1f2c?w=300'
    },
    {
      id: '7',
      platform: '哔哩哔哩',
      content: '蜡笔小新的春日部市巡礼指南！这些地方你去过几个？',
      author: 'shinchan_lover',
      likes: 1245,
      comments: 87,
      timestamp: '2023-07-22',
      sentiment: 'positive',
      relevance: 83,
      imageUrl: 'https://images.unsplash.com/photo-1572205091568-49eba45f7a0c?w=300'
    },
    {
      id: '8',
      platform: '小红书',
      content: '《灌篮高手》剧场版上映后，镰仓高校前的游客太多了，拍照都要排队',
      author: 'japan_travel',
      likes: 2356,
      comments: 187,
      timestamp: '2023-08-05',
      sentiment: 'neutral',
      relevance: 91
    },
    {
      id: '9',
      platform: '抖音',
      content: '东京塔票价真的不便宜，但是为了柯南还是要去一次！',
      author: 'budget_travel',
      likes: 765,
      comments: 34,
      timestamp: '2023-10-15',
      sentiment: 'negative',
      relevance: 75
    },
    {
      id: '10',
      platform: '哔哩哔哩',
      content: '为什么大家都推荐去大洗町？作为战车迷我来告诉你原因！',
      author: 'tank_otaku',
      likes: 3211,
      comments: 245,
      timestamp: '2023-11-02',
      sentiment: 'positive',
      relevance: 94
    }
  ];

  private supportedPlatforms = [
    { id: 'bilibili', name: '哔哩哔哩', icon: '📺' },
    { id: 'xiaohongshu', name: '小红书', icon: '📕' },
    { id: 'weibo', name: '微博', icon: '🌐' },
    { id: 'douyin', name: '抖音', icon: '🎵' }
  ];

  private crawlerStats = {
    totalCrawls: 158,
    totalDataCollected: 12845,
    lastCrawlTime: '2023-12-15T09:30:00',
    platformStats: {
      '哔哩哔哩': 5246,
      '小红书': 3857,
      '微博': 2491,
      '抖音': 1251
    }
  };

  async getSocialData(
    platform?: string, 
    keyword?: string, 
    limit?: number
  ): Promise<SocialData[]> {
    let result = [...this.mockSocialData];
    
    if (platform) {
      result = result.filter(item => 
        item.platform.toLowerCase() === platform.toLowerCase());
    }
    
    if (keyword) {
      result = result.filter(item => 
        item.content.toLowerCase().includes(keyword.toLowerCase()));
    }
    
    if (limit && limit > 0) {
      result = result.slice(0, limit);
    }
    
    return result;
  }

  async startCrawling(platforms: string[], keyword: string) {
    // 模拟爬虫操作，实际应用中应该启动实际的爬虫任务
    const crawlId = `crawl-${Date.now()}`;
    
    return {
      crawlId,
      status: 'started',
      message: `开始爬取关于 ${keyword} 的数据，目标平台: ${platforms.join(', ')}`,
      estimatedTime: '120秒',
      platforms
    };
  }

  async getSupportedPlatforms() {
    return this.supportedPlatforms;
  }

  async getCrawlerStats() {
    return this.crawlerStats;
  }
} 