import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// 定义圣地数据接口
interface PilgrimageSpot {
  id: number;
  name: string;
  anime: string;
  lat: number;
  lng: number;
  popularity: number;
  description: string;
  imageUrl?: string;
}

// 扩展的动漫圣地数据
const animePilgrimageSpots: PilgrimageSpot[] = [
  {
    id: 1,
    name: '镰仓高校前站',
    anime: '灌篮高手',
    lat: 35.3091,
    lng: 139.4859,
    popularity: 95,
    description: '灌篮高手中的经典场景，樱木花道与晴子相遇的路口。这个平交道已经成为了灌篮高手迷必到的朝圣地。',
    imageUrl: 'https://pic3.zhimg.com/v2-3ff3bca635b5e2e7fd11247ae8114f47_r.jpg'
  },
  {
    id: 2,
    name: '须磨浦公园',
    anime: '你的名字',
    lat: 34.6377,
    lng: 135.1298,
    popularity: 90,
    description: '电影《你的名字》中出现的标志性场景。影片中男女主角在此相会的场景令人印象深刻。',
    imageUrl: 'https://pic4.zhimg.com/80/v2-7cbe702f945411708b3c358da4566118_720w.webp'
  },
  {
    id: 3,
    name: '东京塔',
    anime: '名侦探柯南',
    lat: 35.6586,
    lng: 139.7454,
    popularity: 88,
    description: '名侦探柯南剧场版多次出现的地标建筑。特别是在《名侦探柯南：贝克街的亡灵》中有关键场景。',
    imageUrl: 'https://p1.img.cctvpic.com/photoworkspace/contentimg/2023/08/04/2023080414284868195.jpg'
  },
  {
    id: 4,
    name: '姬路城',
    anime: '千与千寻',
    lat: 34.8394,
    lng: 134.6939,
    popularity: 85,
    description: '据说是宫崎骏《千与千寻》中汤屋的灵感来源之一。白墙城堡的优雅外观与电影中的场景相似。',
    imageUrl: 'https://youimg1.c-ctrip.com/target/100s11000000qsow6A96D.jpg'
  },
  {
    id: 5,
    name: '大洗町',
    anime: '少女与战车',
    lat: 36.3141,
    lng: 140.5759,
    popularity: 80,
    description: '《少女与战车》的舞台，现已成为重要的动漫圣地。每年都会举办战车祭活动，吸引大量粉丝前来。',
    imageUrl: 'https://pic3.zhimg.com/80/v2-7ac4c0eef7ae937ba357755c3a32151a_720w.webp'
  },
  {
    id: 6,
    name: '江之岛',
    anime: '海街日记',
    lat: 35.3002,
    lng: 139.4797,
    popularity: 82,
    description: '是枝裕和导演的《海街日记》中的主要场景，四姐妹居住的镰仓与江之岛的美景令人难忘。',
    imageUrl: 'https://youimg1.c-ctrip.com/target/100f10000000o7cmoAF46.jpg'
  },
  {
    id: 7,
    name: '富士山五合目',
    anime: '摇曳露营',
    lat: 35.3606,
    lng: 138.7274,
    popularity: 87,
    description: '《摇曳露营》中少女们露营的地点之一，动画中精确还原了富士山的壮丽景色。',
    imageUrl: 'https://pic4.zhimg.com/80/v2-d61ff65cc6c0db0cf48334b806668f64_720w.webp'
  },
  {
    id: 8,
    name: '忍野八海',
    anime: '摇曳露营',
    lat: 35.4569,
    lng: 138.8275,
    popularity: 84,
    description: '《摇曳露营》中另一处知名场景，以富士山融雪形成的八个清泉闻名。',
    imageUrl: 'https://pic3.zhimg.com/80/v2-6e95002ed5c0edd465542f9688ef9539_720w.webp'
  },
  {
    id: 9,
    name: '鹿儿岛',
    anime: '萤火之森',
    lat: 31.5969,
    lng: 130.5571,
    popularity: 78,
    description: '《萤火之森》的故事背景地，神秘的森林和山间神社的灵感来源。',
    imageUrl: 'https://pic3.zhimg.com/80/v2-1c1a5fddaa20ce52d8b28b8a83aa32cb_720w.webp'
  },
  {
    id: 10,
    name: '京都伏见稻荷大社',
    anime: '犬夜叉',
    lat: 34.9671,
    lng: 135.7727,
    popularity: 92,
    description: '《犬夜叉》中神社的原型之一，也出现在多部动漫作品中。著名的千本鸟居是必访景点。',
    imageUrl: 'https://youimg1.c-ctrip.com/target/100s12000000sx9rqF7BB.jpg'
  }
];

function MapVisualization() {
  const [selectedSpot, setSelectedSpot] = useState<PilgrimageSpot | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [hoveredSpot, setHoveredSpot] = useState<PilgrimageSpot | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<{[key: number]: L.Marker}>({});
  const [mapInitialized, setMapInitialized] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [useStaticMap, setUseStaticMap] = useState(false);
  
  // 直接使用所有圣地数据，不需要过滤
  const filteredSpots = animePilgrimageSpots;

  // 圣地类别
  const animeCategories = [...new Set(animePilgrimageSpots.map(spot => spot.anime))];
  
  // 处理圣地点击
  const handleSpotClick = (spot: PilgrimageSpot) => {
    setSelectedSpot(spot);
    
    // 如果地图已初始化，将其中心移动到所选地点
    if (mapRef.current) {
      mapRef.current.flyTo([spot.lat, spot.lng], 12, {
        duration: 1.5,
        easeLinearity: 0.25
      });
      
      // 打开该标记的弹出窗口
      if (markersRef.current[spot.id]) {
        markersRef.current[spot.id].openPopup();
      }
    }
  };

  // 创建自定义图标
  const createCustomIcon = (isSelected: boolean) => {
    return L.divIcon({
      html: `
        <div class="custom-marker ${isSelected ? 'selected' : ''}">
          <div class="pulse-ring"></div>
          <div class="marker-inner"></div>
        </div>
      `,
      className: 'custom-marker-container',
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    });
  };

  // 尝试初始化Leaflet地图
  const initLeafletMap = () => {
    try {
      if (!mapContainerRef.current) {
        console.error('地图容器不存在');
        setMapError(true);
        return;
      }
      
      // 确保容器有明确的尺寸
      const container = mapContainerRef.current;
      container.style.width = '100%';
      container.style.height = '100%';
      container.style.minHeight = '600px';
      
      // 创建一个基础的Leaflet地图
      const map = L.map(container, {
        center: [36.5, 138], // 日本中心位置
        zoom: 5,
        zoomControl: true,
        attributionControl: false, // 禁用归因控件
        zoomAnimation: true,
        markerZoomAnimation: true
      });
      
      // 添加暗色地图图层
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(map);
      
      // 添加缩放控件到右下角
      L.control.zoom({
        position: 'bottomright'
      }).addTo(map);
      
      // 清除现有标记
      Object.values(markersRef.current).forEach(marker => {
        marker.remove();
      });
      markersRef.current = {};
      
      // 添加标记
      animePilgrimageSpots.forEach(spot => {
        const isSelected = selectedSpot?.id === spot.id;
        const icon = createCustomIcon(isSelected);
        
        const marker = L.marker([spot.lat, spot.lng], { icon })
          .addTo(map)
          .bindPopup(`
            <div class="custom-popup">
              <h3>${spot.name}</h3>
              <p class="anime-name">${spot.anime}</p>
            </div>
          `);
          
        marker.on('click', () => {
          setSelectedSpot(spot);
        });
        
        // 保存标记引用
        markersRef.current[spot.id] = marker;
        
        // 如果是选中的标记，打开弹窗
        if (isSelected) {
          marker.openPopup();
        }
      });
      
      // 保存地图引用
      mapRef.current = map;
      setMapInitialized(true);
      
      // 如果有选中的地点，将地图中心设置到那里
      if (selectedSpot) {
        map.setView([selectedSpot.lat, selectedSpot.lng], 10);
      }
      
      // 确保地图在容器内正确渲染
      setTimeout(() => {
        map.invalidateSize();
      }, 100);
      
    } catch (error) {
      console.error('地图初始化失败:', error);
      setMapError(true);
      setUseStaticMap(true);
    }
  };
  
  // 使用静态备用地图
  const showStaticMap = () => {
    setUseStaticMap(true);
    setMapError(true);
  };
  
  // 更新标记
  const updateMarkers = () => {
    if (!mapRef.current) return;
    
    // 更新所有标记的图标
    Object.entries(markersRef.current).forEach(([id, marker]) => {
      const spotId = parseInt(id);
      const isSelected = selectedSpot?.id === spotId;
      const icon = createCustomIcon(isSelected);
      
      marker.setIcon(icon);
      
      // 如果是选中的标记，确保弹出窗口打开
      if (isSelected) {
        marker.openPopup();
      }
    });
  };
  
  // 强制初始化地图 - 仅在组件挂载时执行一次
  useEffect(() => {
    // 防止重复初始化
    if (mapRef.current) return;
    
    // 首先尝试初始化Leaflet地图
    initLeafletMap();
    
    // 设置15秒超时，如果地图仍未初始化则显示静态地图
    const timeoutId = setTimeout(() => {
      if (!mapInitialized && !mapError) {
        console.log('地图初始化超时，切换到静态地图');
        showStaticMap();
      }
    }, 15000);
    
    // 为避免内存泄漏，组件卸载时清理
    return () => {
      clearTimeout(timeoutId);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);
  
  // 当选中地点变化时，更新地图视图和标记
  useEffect(() => {
    if (selectedSpot && mapRef.current && !useStaticMap) {
      mapRef.current.flyTo([selectedSpot.lat, selectedSpot.lng], 12, {
        duration: 1.5,
        easeLinearity: 0.25
      });
      
      // 更新标记状态
      updateMarkers();
    }
  }, [selectedSpot]);
  
  // 当侧边栏状态变化时，重新计算地图大小
  useEffect(() => {
    if (mapRef.current && !useStaticMap) {
      // 添加短暂延迟以确保DOM已更新
      setTimeout(() => {
        mapRef.current?.invalidateSize();
      }, 300);
    }
  }, [isSidebarOpen]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      {/* 预留顶部导航栏空间 */}
      <div className="h-16"></div>
      
      <div className="flex-1 pb-4 px-0">
        {/* 主内容区域 - 固定高度确保地图填充 */}
        <div className="flex flex-row h-[calc(100vh-16px)]">
          {/* 左侧列表 - 完全重新设计，更现代优雅 */}
          <div 
            className={`transition-all duration-300 ease-in-out border-r border-gray-800 bg-gray-900 overflow-hidden map-visualization-sidebar
                        ${isSidebarOpen ? 'w-80 min-w-80' : 'w-0 min-w-0 overflow-hidden'}`}
            style={{ height: 'calc(100vh - 16px)' }}
          >
            {/* 全新设计的侧边栏 */}
            <div className="h-full flex flex-col bg-gradient-to-br from-gray-900 to-gray-800">
              {/* 圣地列表 - 卡片式设计 */}
              <div className="px-4 pt-4 overflow-y-auto flex-1 custom-scrollbar">
                {filteredSpots.length > 0 ? (
                  <div className="space-y-3 py-2">
                    {filteredSpots.map((spot, index) => (
                  <motion.div 
                    key={spot.id}
                        className={`relative overflow-hidden rounded-lg cursor-pointer transition-all duration-200 ease-out
                                  ${selectedSpot?.id === spot.id 
                                    ? 'bg-blue-900/70 border-l-4 border-blue-500 shadow-md' 
                                    : 'bg-gray-800/40 hover:bg-gray-700/60 border-l-4 border-transparent hover:border-blue-400'}`}
                    onClick={() => handleSpotClick(spot)}
                        onMouseEnter={() => setHoveredSpot(spot)}
                        onMouseLeave={() => setHoveredSpot(null)}
                        whileHover={{ x: 3, transition: { duration: 0.2 } }}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.03 }}
                      >
                        <div className="p-2.5">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <div className={`w-5 h-5 flex items-center justify-center rounded-full mr-2 text-xs
                                              ${selectedSpot?.id === spot.id 
                                                ? 'bg-blue-500 text-white' 
                                                : 'bg-gray-700 text-gray-300'}`}>
                                {index + 1}
                              </div>
                              <h4 className="font-medium text-white">{spot.name}</h4>
                            </div>
                            <div className="text-xs text-gray-400">
                              {spot.popularity}
                            </div>
                          </div>
                          
                          <div className="flex items-center mt-1 ml-7">
                            <div className="text-xs text-cyan-400">
                              {spot.anime}
                            </div>
                          </div>
                        </div>
                  </motion.div>
                ))}
              </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-40 text-center">
                    <div className="text-blue-400 mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="text-gray-400">没有找到匹配的圣地</div>
                  </div>
                )}
                </div>
            </div>
          </div>
          
          {/* 右侧地图 - 完全铺满剩余空间 */}
          <div className="flex-1 bg-gray-800 overflow-hidden relative" 
               style={{ height: 'calc(100vh - 16px)' }}>
            
            {/* 使用静态地图作为备选 */}
            {useStaticMap ? (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gray-800 overflow-hidden">
                <div className="text-blue-500 text-xl mb-4">使用备用静态地图</div>
                
                {/* 简化版备用地图 - 日本地图 */}
                <div className="w-full h-[500px] flex-1 relative overflow-hidden p-4">
                  <div className="absolute inset-0 bg-gray-900 p-2 flex items-center justify-center border border-gray-700">
                    {/* 简单的SVG静态地图 */}
                    <svg width="100%" height="100%" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid meet">
                      <rect x="0" y="0" width="800" height="600" fill="#111827" />
                      
                      {/* 日本地图轮廓 */}
                      <path d="M500,100 C650,150 700,300 650,400 C600,500 550,520 450,450 C350,380 300,330 350,250 C400,170 430,120 500,100 Z" 
                        fill="none" stroke="#555" strokeWidth="2" />
                      
                      {/* 标记点 */}
                      {animePilgrimageSpots.map((spot, index) => {
                        // 简单映射经纬度到SVG坐标 (非精确)
                        const x = 300 + (spot.lng - 135) * 40;
                        const y = 300 - (spot.lat - 35) * 40;
                        const isSelected = selectedSpot?.id === spot.id;
                        
                        return (
                          <g key={spot.id} onClick={() => setSelectedSpot(spot)} style={{cursor: 'pointer'}}>
                            <circle 
                              cx={x} 
                              cy={y} 
                              r={isSelected ? 8 : 6} 
                              fill={isSelected ? "#FF3366" : "#3B82F6"} 
                              stroke="#fff" 
                              strokeWidth="2"
                            />
                            {isSelected && (
                              <circle 
                                cx={x} 
                                cy={y} 
                                r="16" 
                                fill="none" 
                                stroke="#FF3366" 
                                strokeWidth="2" 
                                opacity="0.6"
                              >
                                <animate attributeName="r" from="10" to="25" dur="1.5s" repeatCount="indefinite" />
                                <animate attributeName="opacity" from="0.8" to="0" dur="1.5s" repeatCount="indefinite" />
                              </circle>
                            )}
                            <text 
                              x={x + 10} 
                              y={y + 4} 
                              fill={isSelected ? "#FF3366" : "#fff"} 
                              fontSize="12" 
                              fontWeight={isSelected ? "bold" : "normal"}
                            >
                              {spot.name}
                            </text>
                          </g>
                        );
                      })}
                      
                      <text x="400" y="50" fill="#fff" fontSize="24" textAnchor="middle" fontWeight="bold">日本动漫圣地地图</text>
                    </svg>
                  </div>
                </div>
                
                <button 
                  onClick={() => { setUseStaticMap(false); setMapError(false); initLeafletMap(); }}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
                >
                  重试加载交互式地图
                </button>
              </div>
            ) : (
              <>
                {/* Leaflet 地图容器 */}
                {!mapInitialized && !mapError && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
                    <div className="flex flex-col items-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-3"></div>
                      <div className="text-blue-500 text-xl">加载地图中...</div>
                    </div>
                  </div>
                )}
                
                {mapError && !useStaticMap && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 z-10">
                    <div className="text-red-500 text-xl mb-4">地图加载失败</div>
                    <button 
                      onClick={showStaticMap}
                      className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
                    >
                      使用备用静态地图
                    </button>
                  </div>
                )}
                
                <div 
                  ref={mapContainerRef} 
                  id="map-container"
                  className="w-full h-full" 
                  style={{ minHeight: '600px' }}
              ></div>
                
                {/* 悬浮卡片 - 在鼠标悬停时显示 */}
                {hoveredSpot && hoveredSpot.id !== selectedSpot?.id && (
                  <div className="absolute bottom-4 left-4 max-w-xs bg-gray-900/90 backdrop-blur-sm p-3 rounded-lg border border-blue-500/30 shadow-lg z-10">
                    <h3 className="font-bold text-blue-400">{hoveredSpot.name}</h3>
                    <p className="text-sm text-cyan-300">{hoveredSpot.anime}</p>
            </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* 切换侧边栏按钮 */}
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-4 left-0 z-[1000] bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-r-md shadow-lg transition duration-150 ease-in-out"
        style={{ borderTopLeftRadius: '0', borderBottomLeftRadius: '0' }}
      >
        {isSidebarOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7" />
          </svg>
        )}
      </button>
      
      {/* 地图控件 */}
      <div className="fixed bottom-4 right-4 z-[1000] flex flex-col space-y-2">
        <button 
          onClick={() => mapRef.current?.setView([36.5, 138], 5)}
          className="bg-gray-800/90 hover:bg-gray-700 text-white p-2 rounded-lg shadow-md"
          title="重置地图视图"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </button>
      </div>
      
      {/* Leaflet控件样式优化 */}
      <style>{`
        .leaflet-control-zoom {
          margin: 12px !important;
        }
        
        .leaflet-control-zoom a {
          background-color: rgba(30, 41, 59, 0.8) !important;
          color: white !important;
          border-color: #475569 !important;
        }
        
        .leaflet-control-zoom a:hover {
          background-color: rgba(30, 64, 175, 0.8) !important;
        }
        
        .leaflet-popup-content-wrapper {
          background-color: rgba(17, 24, 39, 0.95) !important;
          color: white !important;
          border-radius: 8px !important;
          border: 1px solid rgba(59, 130, 246, 0.3);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        
        .leaflet-popup-tip {
          background-color: rgba(17, 24, 39, 0.95) !important;
        }
        
        .custom-popup h3 {
          color: #93c5fd;
          font-weight: bold;
          margin-bottom: 4px;
        }
        
        .custom-popup .anime-name {
          color: #67e8f9;
          font-size: 14px;
          margin-bottom: 4px;
        }
        
        .custom-popup .popularity {
          color: #f9a8d4;
          font-size: 12px;
        }
        
        .custom-marker-container {
          background: transparent;
          border: none;
        }
        
        .custom-marker {
          position: relative;
          width: 30px;
          height: 30px;
          cursor: pointer;
        }
        
        .custom-marker .marker-inner {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 16px;
          height: 16px;
          background: #3B82F6;
          border: 2px solid white;
          border-radius: 50%;
          transform: translate(-50%, -50%);
          z-index: 1;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
          transition: all 0.3s ease;
        }
        
        .custom-marker:hover .marker-inner {
          transform: translate(-50%, -50%) scale(1.2);
          background: #60A5FA;
        }
        
        .custom-marker.selected .marker-inner {
          background: #FF3366;
          width: 20px;
          height: 20px;
          border: 3px solid white;
        }
        
        .custom-marker .pulse-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 30px;
          height: 30px;
          background: rgba(59, 130, 246, 0.3);
          border-radius: 50%;
          transform: translate(-50%, -50%);
        }
        
        .custom-marker.selected .pulse-ring {
          background: rgba(255, 51, 102, 0.3);
          animation: pulse 1.5s infinite;
        }
        
        @keyframes pulse {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.8;
          }
          70% {
            transform: translate(-50%, -50%) scale(2.5);
            opacity: 0.2;
          }
          100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.8;
          }
        }
        
        .leaflet-container {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(31, 41, 55, 0.5);
          border-radius: 8px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.5);
          border-radius: 8px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.7);
        }
      `}</style>
    </div>
  );
}

export default MapVisualization; 