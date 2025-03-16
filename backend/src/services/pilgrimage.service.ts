import { Injectable } from '@nestjs/common';
import { PilgrimageSpot } from '../models/pilgrimage-spot.model';

@Injectable()
export class PilgrimageService {
  private readonly mockSpots: PilgrimageSpot[] = [
    {
      id: 1,
      name: '镰仓高校前站',
      anime: '灌篮高手',
      lat: 35.3091,
      lng: 139.4859,
      popularity: 95,
      imageUrl: 'https://images.unsplash.com/photo-1622372738946-62e2aedf48f3',
      description: '灌篮高手中的经典场景，樱木花道与晴子相遇的路口。'
    },
    {
      id: 2,
      name: '须磨浦公园',
      anime: '你的名字',
      lat: 34.6377,
      lng: 135.1298,
      popularity: 90,
      imageUrl: 'https://images.unsplash.com/photo-1574236170880-faf57f8d26ef',
      description: '电影《你的名字》中出现的标志性场景。'
    },
    {
      id: 3,
      name: '东京塔',
      anime: '名侦探柯南',
      lat: 35.6586,
      lng: 139.7454,
      popularity: 88,
      imageUrl: 'https://images.unsplash.com/photo-1551641506-ee5bf4cb45f1',
      description: '名侦探柯南剧场版多次出现的地标建筑。'
    },
    {
      id: 4,
      name: '姬路城',
      anime: '千与千寻',
      lat: 34.8394,
      lng: 134.6939,
      popularity: 85,
      imageUrl: 'https://images.unsplash.com/photo-1590253230532-a67f6bc61c9e',
      description: '据说是宫崎骏《千与千寻》中汤屋的灵感来源之一。'
    },
    {
      id: 5,
      name: '大洗町',
      anime: '少女与战车',
      lat: 36.3141,
      lng: 140.5759,
      popularity: 80,
      imageUrl: 'https://images.unsplash.com/photo-1613861614193-f7f245e61df2',
      description: '《少女与战车》的舞台，现已成为重要的动漫圣地。'
    },
    {
      id: 6,
      name: '京都动画总部',
      anime: '冰菓',
      lat: 34.9412,
      lng: 135.7639,
      popularity: 78,
      imageUrl: 'https://images.unsplash.com/photo-1576786230663-ebb0c6db1f2c',
      description: '京都动画制作的多部作品取景于京都市内。'
    },
    {
      id: 7,
      name: '埼玉县春日部市',
      anime: '蜡笔小新',
      lat: 35.9756,
      lng: 139.7530,
      popularity: 75,
      imageUrl: 'https://images.unsplash.com/photo-1572205091568-49eba45f7a0c',
      description: '蜡笔小新的故事舞台，现实中的春日部市。'
    }
  ];

  async getAllSpots(): Promise<PilgrimageSpot[]> {
    return this.mockSpots;
  }

  async getSpotById(id: number): Promise<PilgrimageSpot> {
    const spot = this.mockSpots.find(spot => spot.id === id);
    if (!spot) {
      throw new Error(`圣地ID ${id} 不存在`);
    }
    return spot;
  }

  async getSpotsByAnime(anime: string): Promise<PilgrimageSpot[]> {
    return this.mockSpots.filter(spot => 
      spot.anime.toLowerCase().includes(anime.toLowerCase()));
  }

  async getPopularSpots(limit: number): Promise<PilgrimageSpot[]> {
    return [...this.mockSpots]
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, limit);
  }

  async getStatistics() {
    return {
      totalSpots: this.mockSpots.length,
      totalAnime: new Set(this.mockSpots.map(spot => spot.anime)).size,
      averagePopularity: this.mockSpots.reduce((sum, spot) => sum + spot.popularity, 0) / this.mockSpots.length,
      mostPopular: this.mockSpots.reduce((max, spot) => max.popularity > spot.popularity ? max : spot, this.mockSpots[0]),
    };
  }
} 