import { useState } from 'react';
import { motion } from 'framer-motion';

// 定义数据类型
interface DataSource {
  id: string;
  name: string;
  icon: string;
  status: 'idle' | 'running' | 'success' | 'error';
  progress: number;
  collectedCount: number;
}

interface CrawledData {
  id: string;
  platform: string;
  content: string;
  author: string;
  likes: number;
  comments: number;
  timestamp: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  relevance: number;
  imageUrl?: string;
}

function DataCrawler() {
  const [dataSources, setDataSources] = useState<DataSource[]>([
    { 
      id: 'bilibili', 
      name: '哔哩哔哩', 
      icon: '📺', 
      status: 'idle', 
      progress: 0, 
      collectedCount: 0 
    },
    { 
      id: 'xiaohongshu', 
      name: '小红书', 
      icon: '📕', 
      status: 'idle', 
      progress: 0, 
      collectedCount: 0 
    },
    { 
      id: 'weibo', 
      name: '微博', 
      icon: '🌐', 
      status: 'idle', 
      progress: 0, 
      collectedCount: 0 
    },
    { 
      id: 'douyin', 
      name: '抖音', 
      icon: '🎵', 
      status: 'idle', 
      progress: 0, 
      collectedCount: 0 
    }
  ]);
  
  const [searchKeyword, setSearchKeyword] = useState<string>('灌篮高手 圣地巡礼');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [crawledData, setCrawledData] = useState<CrawledData[]>([]);
  
  // 模拟爬虫数据
  const mockCrawledData: CrawledData[] = [
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
    }
  ];
  
  // 开始爬取数据
  const startCrawling = () => {
    if (isSearching) return;
    
    setIsSearching(true);
    setCrawledData([]);
    
    // 模拟爬虫进度更新
    const updatedSources = dataSources.map(source => ({
      ...source,
      status: 'running' as const,
      progress: 0,
      collectedCount: 0
    }));
    
    setDataSources(updatedSources);
    
    // 模拟逐步增加进度
    let currentProgress = 0;
    
    const progressInterval = setInterval(() => {
      currentProgress += 5;
      
      if (currentProgress <= 100) {
        // 更新各平台爬取进度
        setDataSources(prev => prev.map(source => {
          // 随机增加进度，模拟不同平台爬取速度不同
          const randomProgress = Math.min(
            100, 
            source.progress + Math.floor(Math.random() * 15) + 5
          );
          
          // 增加已收集数据量，最大500条
          const randomCollected = Math.floor(randomProgress / 100 * 500);
          
          return {
            ...source,
            progress: randomProgress,
            collectedCount: randomCollected,
            status: randomProgress < 100 ? 'running' : 'success'
          };
        }));
        
        // 超过50%进度时开始加载模拟数据
        if (currentProgress >= 50) {
          // 随机选择一定数量的假数据添加到结果中
          const dataSubset = [...mockCrawledData]
            .sort(() => 0.5 - Math.random())
            .slice(0, Math.min(5, Math.floor(currentProgress / 20)));
            
          setCrawledData(dataSubset);
        }
      } else {
        // 完成爬取
        clearInterval(progressInterval);
        setIsSearching(false);
        
        setDataSources(prev => prev.map(source => ({
          ...source,
          progress: 100,
          status: 'success',
          collectedCount: Math.floor(Math.random() * 200) + 300 // 300-500条数据
        })));
        
        // 显示所有模拟数据
        setCrawledData(mockCrawledData);
      }
    }, 500);
  };
  
  // 停止爬取
  const stopCrawling = () => {
    setIsSearching(false);
    
    setDataSources(prev => prev.map(source => ({
      ...source,
      status: source.progress < 100 ? 'idle' : 'success'
    })));
  };
  
  // 清除数据
  const clearData = () => {
    setCrawledData([]);
    setDataSources(prev => prev.map(source => ({
      ...source,
      status: 'idle',
      progress: 0,
      collectedCount: 0
    })));
  };

  return (
    <div className="p-4">
      <header className="container mx-auto py-4">
        <h1 className="text-3xl font-bold neon-text-pink">数据爬虫模拟</h1>
        <p className="mt-2 text-gray-400">
          从社交媒体平台获取动漫圣地巡礼相关数据
        </p>
      </header>

      <main className="container mx-auto mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左侧控制面板 */}
          <div className="lg:col-span-1">
            <div className="card bg-dark-elevated mb-4">
              <h2 className="text-xl font-semibold mb-4">搜索设置</h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  搜索关键词
                </label>
                <input
                  type="text"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="w-full bg-dark-base text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-neon-pink"
                  placeholder="输入搜索关键词"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  数据源
                </label>
                <div className="space-y-2">
                  {dataSources.map(source => (
                    <div key={source.id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={source.id}
                        className="h-4 w-4 bg-dark-base border-gray-600 rounded focus:ring-neon-pink"
                        defaultChecked
                      />
                      <label htmlFor={source.id} className="ml-2 text-sm text-gray-300">
                        {source.icon} {source.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button
                  className={`flex-1 py-2 px-4 rounded-md ${
                    isSearching 
                      ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                      : 'bg-neon-pink bg-opacity-20 neon-text-pink hover:bg-opacity-30'
                  }`}
                  onClick={startCrawling}
                  disabled={isSearching}
                >
                  开始爬取
                </button>
                <button
                  className={`flex-1 py-2 px-4 rounded-md ${
                    !isSearching 
                      ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                      : 'bg-neon-purple bg-opacity-20 neon-text-purple hover:bg-opacity-30'
                  }`}
                  onClick={stopCrawling}
                  disabled={!isSearching}
                >
                  停止爬取
                </button>
                <button
                  className="flex-1 py-2 px-4 rounded-md bg-dark-surface text-gray-300 hover:bg-gray-700"
                  onClick={clearData}
                >
                  清除数据
                </button>
              </div>
            </div>
            
            {/* 进度面板 */}
            <div className="card bg-dark-elevated">
              <h2 className="text-xl font-semibold mb-4">爬取进度</h2>
              
              <div className="space-y-4">
                {dataSources.map(source => (
                  <div key={source.id}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-300">{source.name}</span>
                      <span className="text-sm text-gray-300">
                        {source.progress}% | {source.collectedCount} 条
                      </span>
                    </div>
                    <div className="w-full bg-dark-base rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${
                          source.status === 'error' 
                            ? 'bg-red-500' 
                            : source.status === 'success' 
                              ? 'bg-gradient-to-r from-neon-pink to-neon-purple' 
                              : 'bg-neon-pink'
                        }`}
                        style={{ width: `${source.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* 右侧爬取结果 */}
          <div className="lg:col-span-2">
            <div className="card bg-dark-elevated h-full">
              <h2 className="text-xl font-semibold mb-4">爬取结果</h2>
              
              {crawledData.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[200px] text-gray-400">
                  <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p>尚未爬取任何数据</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {crawledData.map((item) => (
                    <motion.div 
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-dark-surface rounded-lg"
                    >
                      <div className="flex">
                        {item.imageUrl && (
                          <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0 mr-4">
                            <img 
                              src={item.imageUrl} 
                              alt="爬取的图片" 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-neon-pink">{item.platform}</span>
                            <span className="text-xs text-gray-400">{item.timestamp}</span>
                          </div>
                          <p className="text-sm mb-2">{item.content}</p>
                          <div className="flex justify-between text-xs text-gray-400">
                            <span>作者: {item.author}</span>
                            <div className="flex space-x-3">
                              <span>❤️ {item.likes}</span>
                              <span>💬 {item.comments}</span>
                            </div>
                          </div>
                          <div className="flex justify-between mt-2">
                            <span className="text-xs px-2 py-1 rounded-full bg-dark-base">
                              情感: 
                              <span className={
                                item.sentiment === 'positive' ? 'text-green-400' :
                                item.sentiment === 'negative' ? 'text-red-400' : 'text-blue-400'
                              }>
                                {' '}
                                {
                                  item.sentiment === 'positive' ? '正面' :
                                  item.sentiment === 'negative' ? '负面' : '中性'
                                }
                              </span>
                            </span>
                            <span className="text-xs px-2 py-1 rounded-full bg-dark-base">
                              相关度: <span className="text-neon-blue">{item.relevance}%</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default DataCrawler; 