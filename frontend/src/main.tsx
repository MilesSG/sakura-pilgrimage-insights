import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import router from './router'
import 'leaflet/dist/leaflet.css'
import './leaflet-styles.css'
import './style.css'

// 自定义全局错误边界
class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("应用错误:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '20px', 
          color: 'white', 
          backgroundColor: '#333',
          margin: '20px auto',
          maxWidth: '800px',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h1 style={{ color: '#FF00FF' }}>出错了</h1>
          <p>应用遇到了问题，请尝试以下解决方案：</p>
          <ul style={{ 
            textAlign: 'left', 
            display: 'inline-block',
            margin: '20px auto'
          }}>
            <li>刷新页面</li>
            <li>清除浏览器缓存</li>
            <li>直接访问: <a 
                  href="/standalone.html" 
                  style={{ color: '#00FFFF' }}
                >独立图表页面</a>
            </li>
          </ul>
          <div>
            <button 
              onClick={() => window.location.href = '/'}
              style={{
                backgroundColor: '#FF00FF',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                margin: '0 10px',
                cursor: 'pointer'
              }}
            >
              返回首页
            </button>
            <button 
              onClick={() => window.location.href = '/standalone.html'}
              style={{
                backgroundColor: '#00FFFF',
                color: 'black',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                margin: '0 10px',
                cursor: 'pointer'
              }}
            >
              查看独立图表
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// 移除React严格模式，可能会减少一些渲染问题
ReactDOM.createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <RouterProvider router={router} />
  </ErrorBoundary>
) 