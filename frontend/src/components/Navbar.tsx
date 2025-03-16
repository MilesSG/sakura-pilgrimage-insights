import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const navItems = [
  { name: '首页', path: '/' },
  { name: '爬虫模块', path: '/crawler' },
  { name: '分析引擎', path: '/analysis' },
  { name: '地图可视化', path: '/map' },
  { name: '测试页面', path: '/test' },
];

function Navbar() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50" style={{ background: 'var(--dark-elevated)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
      <div className="container">
        <div className="flex items-center justify-between" style={{ height: '4rem' }}>
          {/* Logo区域 */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold neon-text-blue">动漫圣地巡礼</span>
            </Link>
          </div>
          
          {/* 桌面端导航 */}
          <div className="hidden md:block">
            <div className="flex items-center" style={{ gap: '1rem' }}>
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-4 py-4 rounded-lg ${
                      isActive 
                        ? 'neon-text-blue' 
                        : ''
                    }`}
                    style={{ 
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      transition: 'all 0.3s',
                      background: isActive ? 'var(--dark-surface)' : 'transparent',
                      color: isActive ? '' : 'rgba(255, 255, 255, 0.7)',
                      position: 'relative'
                    }}
                    onMouseOver={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'var(--dark-surface)';
                        e.currentTarget.style.color = 'white';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
                      }
                    }}
                  >
                    {item.name}
                    {isActive && (
                      <motion.div
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          height: '2px',
                          background: 'var(--neon-blue)'
                        }}
                        layoutId="navbar-indicator"
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
          
          {/* 移动端菜单按钮 */}
          <div className="block md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                cursor: 'pointer',
                background: 'none',
                border: 'none'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.color = 'white';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
              }}
            >
              <svg 
                style={{ height: '1.5rem', width: '1.5rem' }} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* 移动端菜单 */}
      {isMobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="md:hidden"
          style={{ background: 'var(--dark-elevated)' }}
        >
          <div style={{ padding: '0.5rem 1rem' }}>
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  style={{
                    display: 'block',
                    padding: '0.75rem 1rem',
                    borderRadius: '0.375rem',
                    fontSize: '1rem',
                    fontWeight: '500',
                    marginBottom: '0.25rem',
                    background: isActive ? 'var(--dark-surface)' : 'transparent',
                    color: isActive ? '' : 'rgba(255, 255, 255, 0.7)'
                  }}
                  className={isActive ? 'neon-text-blue' : ''}
                  onClick={() => setIsMobileMenuOpen(false)}
                  onMouseOver={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'var(--dark-surface)';
                      e.currentTarget.style.color = 'white';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
                    }
                  }}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>
        </motion.div>
      )}
    </nav>
  );
}

export default Navbar; 