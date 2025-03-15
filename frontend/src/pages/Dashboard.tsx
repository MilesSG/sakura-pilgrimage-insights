import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

function Dashboard() {
  return (
    <div className="p-4">
      <header className="container py-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold neon-text-blue">
            动漫圣地巡礼数据分析平台
          </h1>
          <p className="mt-4" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
            探索动漫场景与现实地点的关联数据
          </p>
        </motion.div>
      </header>

      <main className="container mt-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {/* 核心功能卡片 */}
          <Link to="/crawler">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="dashboard-card neon-border-pink"
            >
              <h2 className="text-xl font-bold neon-text-pink mb-4">爬虫模拟模块</h2>
              <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>获取B站/小红书数据，分析热门动漫圣地趋势</p>
            </motion.div>
          </Link>

          <Link to="/analysis">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="dashboard-card neon-border-purple"
            >
              <h2 className="text-xl font-bold neon-text-purple mb-4">Spark分析引擎</h2>
              <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>处理影响因素，提取关键数据特征</p>
            </motion.div>
          </Link>

          <Link to="/map">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="dashboard-card neon-border-blue"
            >
              <h2 className="text-xl font-bold neon-text-blue mb-4">3D地图可视化</h2>
              <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>沉浸式体验动漫圣地地理分布</p>
            </motion.div>
          </Link>

          <Link to="/insights">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="dashboard-card neon-border-green"
            >
              <h2 className="text-xl font-bold neon-text-green mb-4">数据驾驶舱</h2>
              <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>多维交互式图表展示巡礼热点数据</p>
            </motion.div>
          </Link>
        </motion.div>

        {/* 地图预览区 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-4 p-4 rounded-lg neon-border-blue flex items-center justify-center"
          style={{ 
            height: '400px',
            background: 'var(--dark-surface)'
          }}
        >
          <p className="text-xl neon-text-blue">探索3D地图 <Link to="/map" style={{ textDecoration: 'underline' }}>点击进入</Link></p>
        </motion.div>

        {/* 数据统计卡片 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="card" style={{ background: 'var(--dark-elevated)' }}>
            <h3 className="text-xl font-bold mb-4">热门圣地</h3>
            <p className="text-4xl font-bold neon-text-pink">298</p>
            <p className="mt-4" style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.5)' }}>全球动漫取景地点</p>
          </div>
          
          <div className="card" style={{ background: 'var(--dark-elevated)' }}>
            <h3 className="text-xl font-bold mb-4">数据样本</h3>
            <p className="text-4xl font-bold neon-text-purple">12,845</p>
            <p className="mt-4" style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.5)' }}>社交媒体数据条目</p>
          </div>
          
          <div className="card" style={{ background: 'var(--dark-elevated)' }}>
            <h3 className="text-xl font-bold mb-4">影响因子</h3>
            <p className="text-4xl font-bold neon-text-green">18</p>
            <p className="mt-4" style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.5)' }}>关键影响数据特征</p>
          </div>
        </motion.div>
      </main>

      <footer className="container mt-4 py-4" style={{ borderTop: '1px solid rgba(75, 75, 75, 0.5)' }}>
        <p className="text-center" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
          动漫圣地巡礼数据分析平台 © {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}

export default Dashboard; 