import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Dashboard from './pages/Dashboard';
import DataCrawler from './pages/DataCrawler';
import SparkAnalysis from './pages/SparkAnalysis';
import MapVisualization from './pages/MapVisualization';
import DataInsights from './pages/DataInsights';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Dashboard />,
      },
      {
        path: '/crawler',
        element: <DataCrawler />,
      },
      {
        path: '/analysis',
        element: <SparkAnalysis />,
      },
      {
        path: '/map',
        element: <MapVisualization />,
      },
      {
        path: '/insights',
        element: <DataInsights />,
      },
    ],
  },
]);

export default router; 