import { createBrowserRouter, useRouteError, isRouteErrorResponse } from 'react-router-dom';
import App from './App';
import Dashboard from './pages/Dashboard';
import DataCrawler from './pages/DataCrawler';
import SparkAnalysis from './pages/SparkAnalysis';
import MapVisualization from './pages/MapVisualization';
import TestChart from './pages/TestChart';
import DebugRawChart from './pages/DebugRawChart';
import PlainChartPage from './pages/PlainChartPage';

// 自定义错误页面组件
function ErrorPage() {
  const error = useRouteError();
  console.error("路由错误:", error);
  
  let errorMessage = '未知错误';
  
  if (isRouteErrorResponse(error)) {
    errorMessage = `${error.status} ${error.statusText}`;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }
  
  return (
    <div style={{
      padding: '20px',
      textAlign: 'center',
      color: 'white',
      backgroundColor: '#222',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <h1 style={{
        color: '#FF00FF',
        marginBottom: '20px',
        fontSize: '24px'
      }}>页面出错了</h1>
      
      <p style={{
        marginBottom: '20px',
        color: '#aaa'
      }}>
        {errorMessage}
      </p>
      
      <div>
        <a 
          href="/"
          style={{
            display: 'inline-block',
            margin: '0 10px',
            padding: '10px 20px',
            backgroundColor: '#FF00FF',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px'
          }}
        >
          返回首页
        </a>
        
        <a 
          href="/standalone.html"
          style={{
            display: 'inline-block',
            margin: '0 10px',
            padding: '10px 20px',
            backgroundColor: '#00FFFF',
            color: 'black',
            textDecoration: 'none',
            borderRadius: '4px'
          }}
        >
          查看独立图表
        </a>
      </div>
    </div>
  );
}

// 简化的最小页面组件
const EmptyPage = () => <div style={{ padding: '20px', color: 'white' }}>加载中...</div>;

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <Dashboard />,
        errorElement: <ErrorPage />
      },
      {
        path: '/crawler',
        element: <DataCrawler />,
        errorElement: <ErrorPage />
      },
      {
        path: '/analysis',
        element: <SparkAnalysis />,
        errorElement: <ErrorPage />
      },
      {
        path: '/test',
        element: <TestChart />,
        errorElement: <ErrorPage />
      },
      {
        path: '/debug',
        element: <DebugRawChart />,
        errorElement: <ErrorPage />
      },
      {
        path: '/map',
        element: <MapVisualization />,
        errorElement: <ErrorPage />
      },
      {
        path: '/plain-chart',
        element: <PlainChartPage />,
        errorElement: <ErrorPage />
      },
      {
        path: '*',
        element: <ErrorPage />
      }
    ],
  },
]);

export default router; 