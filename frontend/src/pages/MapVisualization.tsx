import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import * as THREE from 'three';

// 定义圣地数据接口
interface PilgrimageSpot {
  id: number;
  name: string;
  anime: string;
  lat: number;
  lng: number;
  popularity: number;
  imageUrl: string;
  description: string;
}

// 示例数据
const mockPilgrimageSpots: PilgrimageSpot[] = [
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
  }
];

function MapVisualization() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedSpot, setSelectedSpot] = useState<PilgrimageSpot | null>(null);
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<'map' | '3d'>('map');

  // 初始化地图
  useEffect(() => {
    if (!mapRef.current || mapInstance) return;
    
    // 创建Leaflet地图
    const map = L.map(mapRef.current).setView([35.6586, 139.7454], 5);
    
    // 添加地图图层
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // 自定义霓虹灯标记图标
    const neonIcon = L.divIcon({
      className: 'custom-neon-marker',
      html: `<div class="w-6 h-6 rounded-full bg-dark-base border-2 border-neon-blue shadow-neon-blue animate-neon-pulse"></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });

    // 添加标记
    mockPilgrimageSpots.forEach(spot => {
      const marker = L.marker([spot.lat, spot.lng], { 
        icon: neonIcon,
        title: spot.name
      }).addTo(map);
      
      // 点击标记时显示详情
      marker.on('click', () => {
        setSelectedSpot(spot);
        map.flyTo([spot.lat, spot.lng], 12, {
          duration: 1.5
        });
      });
    });

    setMapInstance(map);
    setIsLoading(false);
    
    return () => {
      map.remove();
    };
  }, []);

  // 初始化3D场景
  useEffect(() => {
    if (view !== '3d' || !mapRef.current || !selectedSpot) return;
    
    // 创建Three.js场景
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, mapRef.current.clientWidth / mapRef.current.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    
    renderer.setSize(mapRef.current.clientWidth, mapRef.current.clientHeight);
    mapRef.current.innerHTML = '';
    mapRef.current.appendChild(renderer.domElement);
    
    // 添加照明
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    
    // 创建一个简单的地球
    const geometry = new THREE.SphereGeometry(5, 32, 32);
    const material = new THREE.MeshStandardMaterial({ 
      color: 0x1E1E1E,
      emissive: 0x121212,
      roughness: 0.7,
      metalness: 0.2
    });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);
    
    // 添加选中圣地的位置标记
    const spotGeometry = new THREE.SphereGeometry(0.2, 16, 16);
    const spotMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x00FFFF,
      emissive: 0x00FFFF,
      emissiveIntensity: 0.5
    });
    const spotMesh = new THREE.Mesh(spotGeometry, spotMaterial);
    
    // 将圣地位置转换为3D坐标
    const phi = (90 - selectedSpot.lat) * (Math.PI / 180);
    const theta = (selectedSpot.lng + 180) * (Math.PI / 180);
    const x = -5 * Math.sin(phi) * Math.cos(theta);
    const y = 5 * Math.cos(phi);
    const z = 5 * Math.sin(phi) * Math.sin(theta);
    
    spotMesh.position.set(x, y, z);
    scene.add(spotMesh);
    
    // 添加连线
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x00FFFF });
    const lineGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(x, y, z)
    ]);
    const line = new THREE.Line(lineGeometry, lineMaterial);
    scene.add(line);
    
    camera.position.z = 15;
    
    // 动画
    const animate = () => {
      requestAnimationFrame(animate);
      sphere.rotation.y += 0.003;
      renderer.render(scene, camera);
    };
    
    animate();
    
    // 清理
    return () => {
      if (mapRef.current) {
        mapRef.current.removeChild(renderer.domElement);
      }
    };
  }, [view, selectedSpot]);

  // 切换回地图视图
  const switchToMapView = () => {
    setView('map');
    if (mapRef.current) {
      mapRef.current.innerHTML = '';
    }
    
    // 重新初始化地图
    if (mapInstance) {
      setTimeout(() => {
        mapInstance.invalidateSize();
        if (selectedSpot) {
          mapInstance.flyTo([selectedSpot.lat, selectedSpot.lng], 12);
        } else {
          mapInstance.flyTo([35.6586, 139.7454], 5);
        }
      }, 100);
    }
  };

  return (
    <div className="p-4">
      <header className="container mx-auto py-4">
        <h1 className="text-3xl font-bold neon-text-blue">动漫圣地地图可视化</h1>
        <p className="mt-2 text-gray-400">
          探索全球各地的动漫取景地点
        </p>
      </header>

      <main className="container mx-auto mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左侧控制面板 */}
          <div className="lg:col-span-1">
            <div className="card bg-dark-elevated mb-4">
              <h2 className="text-xl font-semibold mb-4">视图控制</h2>
              
              <div className="flex space-x-2 mb-4">
                <button 
                  className={`flex-1 py-2 px-4 rounded-md ${view === 'map' ? 'bg-neon-blue bg-opacity-20 neon-text-blue' : 'bg-dark-surface text-gray-300'}`}
                  onClick={() => switchToMapView()}
                >
                  2D地图
                </button>
                <button 
                  className={`flex-1 py-2 px-4 rounded-md ${view === '3d' ? 'bg-neon-green bg-opacity-20 neon-text-green' : 'bg-dark-surface text-gray-300'}`}
                  onClick={() => setView('3d')}
                  disabled={!selectedSpot}
                >
                  3D视图
                </button>
              </div>
              
              <h3 className="text-lg font-medium mb-2">热门圣地</h3>
              <div className="space-y-2">
                {mockPilgrimageSpots.map(spot => (
                  <motion.div 
                    key={spot.id}
                    className={`p-2 rounded-md cursor-pointer transition-all duration-200 ${selectedSpot?.id === spot.id ? 'bg-dark-surface neon-border-blue' : 'hover:bg-dark-surface'}`}
                    onClick={() => {
                      setSelectedSpot(spot);
                      if (mapInstance && view === 'map') {
                        mapInstance.flyTo([spot.lat, spot.lng], 12);
                      }
                    }}
                    whileHover={{ x: 4 }}
                  >
                    <h4 className="font-medium">{spot.name}</h4>
                    <p className="text-sm text-gray-400">{spot.anime}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
          
          {/* 右侧地图区域 */}
          <div className="lg:col-span-2">
            <div className="card bg-dark-elevated h-[600px] relative">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-dark-base bg-opacity-80 z-10">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-10 h-10 border-4 border-neon-blue rounded-full border-t-transparent"
                  />
                </div>
              )}
              
              {/* 地图容器 */}
              <div ref={mapRef} className="w-full h-full"></div>
              
              {/* 选中地点详情 */}
              {selectedSpot && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute bottom-4 right-4 left-4 bg-dark-base bg-opacity-90 p-4 rounded-lg neon-border-blue"
                >
                  <div className="flex items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold neon-text-blue">{selectedSpot.name}</h3>
                      <p className="text-sm text-gray-300">动漫: {selectedSpot.anime}</p>
                      <p className="text-sm mt-2">{selectedSpot.description}</p>
                      <p className="text-sm text-gray-400 mt-1">
                        热度指数: <span className="neon-text-pink">{selectedSpot.popularity}</span>
                      </p>
                    </div>
                    <div className="w-24 h-24 ml-4 rounded-md overflow-hidden">
                      <img 
                        src={`${selectedSpot.imageUrl}?w=100&h=100&fit=crop`} 
                        alt={selectedSpot.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default MapVisualization; 