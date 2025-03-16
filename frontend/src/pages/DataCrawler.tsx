import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// 节点和连接的类型定义
interface Node {
  id: string;
  x: number;
  y: number;
  radius: number;
  color: string;
  label: string;
  fixed: boolean;
  progress?: number;
  status?: 'idle' | 'running' | 'success' | 'error';
  active?: boolean;
}

interface Connection {
  from: string;
  to: string;
  active: boolean;
  packets: DataPacketType[];
}

interface DataPacketType {
  id: number;
  x: number;
  y: number;
  progress: number;
  size: number;
}

interface CrawlerVisualizerProps {
  isActive: boolean;
  sources: DataSource[];
}

// 用于爬虫可视化的组件
const CrawlerVisualizer = ({ isActive, sources }: CrawlerVisualizerProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const platformColors: Record<string, string> = {
    'bilibili': 'rgba(255, 0, 255, 0.8)', // 粉色
    'xiaohongshu': 'rgba(255, 100, 100, 0.8)', // 红色
    'weibo': 'rgba(100, 100, 255, 0.8)', // 蓝色
    'douyin': 'rgba(50, 255, 255, 0.8)', // 青色
  };

  // 初始化可视化
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const centerX = canvasRef.current.width / 2;
    const centerY = canvasRef.current.height / 2;
    
    // 创建中心节点
    const centerNode: Node = {
      id: 'center',
      x: centerX,
      y: centerY,
      radius: 30,
      color: 'rgba(255, 255, 255, 0.8)',
      label: '数据中心',
      fixed: true
    };
    
    // 创建平台节点
    const platformNodes: Node[] = sources.map((source, index) => {
      const angle = (index / sources.length) * Math.PI * 2;
      const radius = 120;
      return {
        id: source.id,
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        radius: 20,
        color: platformColors[source.id] || 'rgba(150, 150, 150, 0.8)',
        label: source.name,
        fixed: true,
        progress: source.progress,
        status: source.status
      };
    });
    
    // 创建连接
    const nodeConnections: Connection[] = platformNodes.map(node => ({
      from: node.id,
      to: 'center',
      active: false,
      packets: []
    }));
    
    setNodes([centerNode, ...platformNodes]);
    setConnections(nodeConnections);
    
  }, [sources]);
  
  // 更新可视化
  useEffect(() => {
    if (!isActive || !canvasRef.current || nodes.length === 0) return;
    
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return; // 确保ctx不为null
    
    const width = canvasRef.current.width;
    const height = canvasRef.current.height;
    
    // 更新节点状态
    const updatedNodes = nodes.map(node => {
      if (node.id !== 'center') {
        const source = sources.find(s => s.id === node.id);
        if (source) {
          return {
            ...node,
            progress: source.progress,
            status: source.status,
            active: source.status === 'running'
          };
        }
      }
      return node;
    });
    
    // 更新连接状态
    const updatedConnections = connections.map(conn => {
      const sourceNode = updatedNodes.find(n => n.id === conn.from);
      if (sourceNode && sourceNode.status === 'running') {
        // 添加数据包
        if (Math.random() < 0.3) {
          const fromNode = updatedNodes.find(n => n.id === conn.from);
          const toNode = updatedNodes.find(n => n.id === conn.to);
          if (fromNode && toNode) {
            return {
              ...conn,
              active: true,
              packets: [
                ...conn.packets,
                {
                  id: Date.now() + Math.random(),
                  x: fromNode.x,
                  y: fromNode.y,
                  progress: 0,
                  size: Math.random() * 5 + 3
                }
              ].slice(0, 10) // 限制数据包数量
            };
          }
        }
        
        // 更新现有数据包位置
        const updatedPackets = conn.packets.map(packet => {
          const newProgress = packet.progress + 0.05;
          if (newProgress >= 1) return null;
          
          const fromNode = updatedNodes.find(n => n.id === conn.from);
          const toNode = updatedNodes.find(n => n.id === conn.to);
          
          // 添加非空检查
          if (!fromNode || !toNode) return null;
          
          const x = fromNode.x + (toNode.x - fromNode.x) * newProgress;
          const y = fromNode.y + (toNode.y - fromNode.y) * newProgress;
          
          return {
            ...packet,
            x,
            y,
            progress: newProgress
          };
        }).filter((p): p is DataPacketType => p !== null); // 类型断言
        
        return {
          ...conn,
          active: true,
          packets: updatedPackets
        };
      }
      
      return {
        ...conn,
        active: false,
        packets: conn.packets.filter(p => p.progress < 1) // 保留未完成的数据包
      };
    });
    
    setNodes(updatedNodes);
    setConnections(updatedConnections);
    
    // 渲染可视化
    const render = () => {
      ctx.clearRect(0, 0, width, height);
      
      // 绘制连接
      updatedConnections.forEach(conn => {
        const fromNode = updatedNodes.find(n => n.id === conn.from);
        const toNode = updatedNodes.find(n => n.id === conn.to);
        
        if (fromNode && toNode) {
          // 绘制连接线
          ctx.beginPath();
          ctx.strokeStyle = conn.active 
            ? platformColors[fromNode.id] || 'rgba(255, 255, 255, 0.6)' 
            : 'rgba(100, 100, 100, 0.3)';
          ctx.lineWidth = conn.active ? 2 : 1;
          ctx.moveTo(fromNode.x, fromNode.y);
          ctx.lineTo(toNode.x, toNode.y);
          ctx.stroke();
          
          // 绘制数据包
          conn.packets.forEach(packet => {
            ctx.beginPath();
            ctx.fillStyle = platformColors[fromNode.id] || 'rgba(255, 255, 255, 0.8)';
            ctx.arc(packet.x, packet.y, packet.size, 0, Math.PI * 2);
            ctx.fill();
          });
        }
      });
      
      // 绘制节点
      updatedNodes.forEach(node => {
        // 绘制节点外圈
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        
        // 中心节点特殊处理
        if (node.id === 'center') {
          const gradient = ctx.createRadialGradient(
            node.x, node.y, 0,
            node.x, node.y, node.radius
          );
          gradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
          gradient.addColorStop(1, 'rgba(150, 150, 150, 0.5)');
          ctx.fillStyle = gradient;
        } else {
          // 平台节点样式
          ctx.fillStyle = node.status === 'success' 
            ? platformColors[node.id] 
            : node.status === 'running'
              ? platformColors[node.id]
              : 'rgba(80, 80, 80, 0.5)';
          
          // 添加进度环
          if (node.progress && node.progress > 0) {
            ctx.save();
            ctx.beginPath();
            ctx.arc(
              node.x, node.y, node.radius, 
              -Math.PI / 2, 
              -Math.PI / 2 + (Math.PI * 2 * node.progress / 100)
            );
            ctx.lineTo(node.x, node.y);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.fill();
            ctx.restore();
          }
        }
        
        ctx.fill();
        
        // 绘制节点边框
        ctx.strokeStyle = node.status === 'running' 
          ? 'rgba(255, 255, 255, 0.8)' 
          : 'rgba(150, 150, 150, 0.5)';
        ctx.lineWidth = node.status === 'running' ? 2 : 1;
        ctx.stroke();
        
        // 绘制节点标签
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.label, node.x, node.y + node.radius + 15);
      });
    };
    
    render();
    
  }, [isActive, nodes, connections, sources]);
  
  return (
    <div className="crawler-visualizer">
      <canvas 
        ref={canvasRef} 
        width={500} 
        height={400}
        className="w-full h-full rounded-lg"
      />
    </div>
  );
};

// 数据流动粒子效果
interface DataPacketProps {
  color: string;
  size: number;
}

const DataPacket = ({ color, size }: DataPacketProps) => {
  return (
    <motion.div
      className="absolute rounded-full"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }}
      style={{ 
        backgroundColor: color,
        width: size,
        height: size,
        boxShadow: `0 0 ${size / 2}px ${color}`
      }}
    />
  );
};

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
  const [totalDataPoints, setTotalDataPoints] = useState<number>(0);
  const [recentKeywords, setRecentKeywords] = useState<string[]>([]);
  
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
    setTotalDataPoints(0);
    
    // 添加关键词到最近搜索
    if (!recentKeywords.includes(searchKeyword)) {
      setRecentKeywords(prev => [searchKeyword, ...prev].slice(0, 5));
    }
    
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
        setDataSources(prev => {
          const updated = prev.map(source => {
            // 随机增加进度，模拟不同平台爬取速度不同
            const randomProgress = Math.min(
              100, 
              source.progress + Math.floor(Math.random() * 15) + 5
            );
            
            // 增加已收集数据量，最大500条
            const randomCollected = Math.floor(randomProgress / 100 * 500);
            const newCollected = randomCollected - source.collectedCount;
            
            // 更新总数据点
            if (newCollected > 0) {
              setTotalDataPoints(prev => prev + newCollected);
            }
            
            return {
              ...source,
              progress: randomProgress,
              collectedCount: randomCollected,
              status: randomProgress < 100 ? 'running' as const : 'success' as const
            };
          });
          
          return updated;
        });
        
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
        setTotalDataPoints(mockCrawledData.length * 100); // 乘以100模拟大量数据
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
        <motion.h1 
          className="text-3xl font-bold neon-text-pink"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          数据爬虫模拟
        </motion.h1>
        <motion.p 
          className="mt-2 text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          从社交媒体平台获取动漫圣地巡礼相关数据
        </motion.p>
      </header>

      <main className="container mx-auto mt-4">
        {/* 添加爬虫可视化组件 */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="card bg-dark-elevated overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">爬虫实时可视化</h2>
              {isSearching && (
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-neon-pink rounded-full mr-2 animate-pulse"></div>
                  <span className="text-sm text-neon-pink">正在爬取数据</span>
                </div>
              )}
            </div>
            <div className="relative" style={{ height: "400px" }}>
              <CrawlerVisualizer isActive={isSearching} sources={dataSources} />
              
              {/* 爬取数据统计 */}
              <div className="absolute bottom-4 right-4 bg-dark-base bg-opacity-70 p-3 rounded-lg">
                <div className="text-sm mb-2">已抓取数据点</div>
                <div className="text-2xl font-bold neon-text-blue">{totalDataPoints.toLocaleString()}</div>
              </div>
            </div>
          </div>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左侧控制面板 */}
          <div className="lg:col-span-1">
            <motion.div 
              className="card bg-dark-elevated mb-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
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
                
                {/* 添加最近搜索关键词 */}
                {recentKeywords.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-400 mb-1">最近搜索:</p>
                    <div className="flex flex-wrap gap-2">
                      {recentKeywords.map((keyword, idx) => (
                        <span 
                          key={idx}
                          onClick={() => setSearchKeyword(keyword)}
                          className="text-xs bg-dark-base px-2 py-1 rounded-md cursor-pointer hover:bg-gray-700"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
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
            </motion.div>
            
            {/* 进度面板 */}
            <motion.div 
              className="card bg-dark-elevated"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <h2 className="text-xl font-semibold mb-4">爬取进度</h2>
              
              <div className="space-y-4">
                {dataSources.map(source => (
                  <div key={source.id}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-300">
                        <span className={source.status === 'running' ? 'animate-pulse' : ''}>
                          {source.icon} {source.name}
                        </span>
                      </span>
                      <span className="text-sm text-gray-300">
                        {source.progress}% | {source.collectedCount} 条
                      </span>
                    </div>
                    <div className="w-full bg-dark-base rounded-full h-2.5 overflow-hidden">
                      <motion.div 
                        className={`h-2.5 ${
                          source.status === 'error' 
                            ? 'bg-red-500' 
                            : source.status === 'success' 
                              ? 'bg-gradient-to-r from-neon-pink to-neon-purple' 
                              : 'bg-neon-pink'
                        }`}
                        style={{ width: `${source.progress}%` }}
                        initial={{ width: '0%' }}
                        animate={{ width: `${source.progress}%` }}
                        transition={{ type: "spring", stiffness: 50 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
          
          {/* 右侧爬取结果 */}
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="card bg-dark-elevated">
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
                  <AnimatePresence>
                  {crawledData.map((item) => (
                    <motion.div 
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="p-4 bg-dark-surface rounded-lg overflow-hidden relative"
                      whileHover={{ 
                        boxShadow: '0 0 8px rgba(255, 0, 255, 0.5)',
                        scale: 1.01,
                        transition: { duration: 0.2 }
                      }}
                    >
                      <div className="flex">
                        {item.imageUrl && (
                          <motion.div 
                            className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0 mr-4"
                            whileHover={{ scale: 1.05 }}
                          >
                            <img 
                              src={item.imageUrl} 
                              alt="爬取的图片" 
                              className="w-full h-full object-cover"
                            />
                          </motion.div>
                        )}
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold neon-text-pink">{item.platform}</span>
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
                  </AnimatePresence>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

export default DataCrawler; 