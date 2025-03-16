import { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';

// 极简页面 - 不使用任何React Router或复杂组件逻辑
function PlainChartPage() {
  const chartRef = useRef<HTMLDivElement>(null);
  const [chartType, setChartType] = useState<'pie' | 'bar' | 'line'>('pie');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const chartInstanceRef = useRef<echarts.ECharts | null>(null);

  // 安全地初始化图表 
  const initChart = () => {
    try {
      if (!chartRef.current) {
        setError('图表容器未找到');
        return;
      }

      // 清理现有实例
      if (chartInstanceRef.current && !chartInstanceRef.current.isDisposed()) {
        chartInstanceRef.current.dispose();
      }

      setLoading(true);
      setError(null);

      // 确保容器尺寸正常
      const container = chartRef.current;
      if (container.offsetWidth === 0 || container.offsetHeight === 0) {
        setError('图表容器尺寸异常');
        return;
      }

      // 创建实例
      const chart = echarts.init(container);
      chartInstanceRef.current = chart;

      // 配置
      let option;
      
      switch (chartType) {
        case 'pie':
          option = {
            backgroundColor: 'transparent',
            title: {
              text: '各地区访问量分布',
              left: 'center',
              textStyle: { color: '#fff' }
            },
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b}: {c} ({d}%)'
            },
            legend: {
              orient: 'vertical',
              left: 'left',
              textStyle: { color: '#fff' }
            },
            series: [
              {
                name: '访问来源',
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                itemStyle: {
                  borderRadius: 10,
                  borderColor: '#222',
                  borderWidth: 2
                },
                label: {
                  show: true,
                  color: '#fff'
                },
                emphasis: {
                  label: {
                    show: true,
                    fontSize: 16,
                    fontWeight: 'bold'
                  }
                },
                data: [
                  { value: 1048, name: '东京' },
                  { value: 735, name: '京都' },
                  { value: 580, name: '大阪' },
                  { value: 484, name: '奈良' },
                  { value: 300, name: '其他' }
                ]
              }
            ]
          };
          break;
          
        case 'bar':
          option = {
            backgroundColor: 'transparent',
            title: {
              text: '各地区游客数量',
              left: 'center',
              textStyle: { color: '#fff' }
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: { type: 'shadow' }
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            xAxis: {
              type: 'category',
              data: ['东京', '京都', '大阪', '奈良', '神户', '镰仓', '富士山'],
              axisLine: {
                lineStyle: { color: '#ccc' }
              },
              axisLabel: { color: '#fff' }
            },
            yAxis: {
              type: 'value',
              axisLine: {
                lineStyle: { color: '#ccc' }
              },
              axisLabel: { color: '#fff' },
              splitLine: {
                lineStyle: { color: 'rgba(255, 255, 255, 0.1)' }
              }
            },
            series: [
              {
                name: '游客数量',
                type: 'bar',
                barWidth: '60%',
                data: [
                  {value: 1050, itemStyle: {color: '#FF00FF'}},
                  {value: 820, itemStyle: {color: '#00FFFF'}},
                  {value: 750, itemStyle: {color: '#39FF14'}},
                  {value: 600, itemStyle: {color: '#FFA500'}},
                  {value: 500, itemStyle: {color: '#1E90FF'}},
                  {value: 380, itemStyle: {color: '#FF6347'}},
                  {value: 250, itemStyle: {color: '#9370DB'}}
                ]
              }
            ]
          };
          break;
          
        case 'line':
          option = {
            backgroundColor: 'transparent',
            title: {
              text: '月度访问量趋势',
              left: 'center',
              textStyle: { color: '#fff' }
            },
            tooltip: {
              trigger: 'axis'
            },
            legend: {
              data: ['东京', '京都'],
              textStyle: { color: '#fff' },
              top: 30
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            xAxis: {
              type: 'category',
              boundaryGap: false,
              data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
              axisLine: {
                lineStyle: { color: '#ccc' }
              },
              axisLabel: { color: '#fff' }
            },
            yAxis: {
              type: 'value',
              axisLine: {
                lineStyle: { color: '#ccc' }
              },
              axisLabel: { color: '#fff' },
              splitLine: {
                lineStyle: { color: 'rgba(255, 255, 255, 0.1)' }
              }
            },
            series: [
              {
                name: '东京',
                type: 'line',
                data: [120, 132, 101, 134, 290, 230, 220, 300, 180, 160, 140, 190],
                itemStyle: { color: '#FF00FF' },
                lineStyle: { width: 3 }
              },
              {
                name: '京都',
                type: 'line',
                data: [80, 70, 90, 250, 260, 170, 140, 190, 140, 120, 100, 110],
                itemStyle: { color: '#00FFFF' },
                lineStyle: { width: 3 }
              }
            ]
          };
          break;
      }

      // 设置选项
      chart.setOption(option);
      
      // 设置窗口大小变化的监听器
      const handleResize = () => {
        if (chart && !chart.isDisposed()) {
          chart.resize();
        }
      };
      
      window.addEventListener('resize', handleResize);
      
      setLoading(false);
      
      // 返回清理函数，移除事件监听器
      return () => {
        window.removeEventListener('resize', handleResize);
      };
      
    } catch (e) {
      console.error('图表初始化失败:', e);
      setError(`图表初始化失败: ${e instanceof Error ? e.message : '未知错误'}`);
      setLoading(false);
    }
  };

  // 当组件挂载或图表类型变化时，初始化图表
  useEffect(() => {
    const cleanup = initChart();
    
    return () => {
      // 调用之前返回的清理函数
      if (cleanup) cleanup();
      
      // 清理图表实例
      if (chartInstanceRef.current && !chartInstanceRef.current.isDisposed()) {
        chartInstanceRef.current.dispose();
        chartInstanceRef.current = null;
      }
    };
  }, [chartType]);

  return (
    <div className="flex flex-col items-center p-5">
      <h1 className="text-2xl font-bold text-center mb-5 text-fuchsia-500">
        简单图表显示页面
      </h1>
      
      <p className="text-gray-300 mb-5 text-center max-w-2xl">
        这是一个专用于展示图表的简单页面，避免复杂的组件结构可能导致的渲染问题。
        您可以通过下方按钮切换不同类型的图表。
      </p>
      
      {/* 图表类型选择器 */}
      <div className="flex mb-6 space-x-4">
        <button
          onClick={() => setChartType('pie')}
          className={`px-4 py-2 rounded ${
            chartType === 'pie' 
              ? 'bg-fuchsia-500 text-white' 
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          饼图
        </button>
        <button
          onClick={() => setChartType('bar')}
          className={`px-4 py-2 rounded ${
            chartType === 'bar' 
              ? 'bg-cyan-500 text-black' 
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          柱状图
        </button>
        <button
          onClick={() => setChartType('line')}
          className={`px-4 py-2 rounded ${
            chartType === 'line' 
              ? 'bg-green-500 text-black' 
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          折线图
        </button>
      </div>
      
      {/* 错误提示 */}
      {error && (
        <div className="w-full max-w-2xl p-3 mb-5 bg-red-900/30 border border-red-700 rounded text-red-400 text-center">
          <p className="font-bold mb-2">错误</p>
          <p>{error}</p>
          <button 
            onClick={initChart}
            className="mt-2 px-3 py-1 bg-red-700 text-white rounded text-sm hover:bg-red-600"
          >
            尝试重载
          </button>
        </div>
      )}
      
      {/* 图表容器 */}
      <div className="w-full max-w-4xl bg-gray-800 rounded-lg p-5 mb-5 border border-gray-700">
        <div 
          ref={chartRef} 
          className="w-full" 
          style={{ height: '500px', position: 'relative' }}
        >
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-10">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 border-4 border-gray-500 border-t-cyan-500 rounded-full animate-spin mb-3"></div>
                <span className="text-cyan-500">加载中...</span>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* 按钮区 */}
      <div className="flex space-x-4 mt-2">
        <button
          onClick={initChart}
          className="px-4 py-2 bg-fuchsia-500 text-white rounded hover:bg-fuchsia-600"
        >
          刷新图表
        </button>
        <a
          href="/"
          className="px-4 py-2 bg-cyan-500 text-black rounded hover:bg-cyan-600"
        >
          返回首页
        </a>
      </div>
    </div>
  );
}

export default PlainChartPage; 