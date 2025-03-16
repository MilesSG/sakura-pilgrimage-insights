import { useState, useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { EChartsOption } from 'echarts';

// 极度简化的测试组件
function TestChart() {
  const chartRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    console.log("组件挂载，准备初始化图表");
    
    // 设置超时以确保DOM已经完全准备好
    const timer = setTimeout(() => {
      try {
        if (!chartRef.current) {
          console.error("图表容器DOM元素不存在");
          return;
        }

        console.log("开始初始化图表");
        const chart = echarts.init(chartRef.current);
        
        // 极简的图表配置
        const option: EChartsOption = {
          title: {
            text: '测试图表',
            textStyle: { color: '#ffffff' }
          },
          tooltip: {
            trigger: 'axis'
          },
          xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            axisLabel: { color: '#ffffff' }
          },
          yAxis: {
            type: 'value',
            axisLabel: { color: '#ffffff' }
          },
          series: [
            {
              name: '测试数据',
              type: 'bar',
              data: [23, 24, 18, 25, 27, 28, 25],
              color: '#FF00FF'
            }
          ],
          backgroundColor: 'transparent'
        };
        
        console.log("设置图表选项");
        chart.setOption(option);
        console.log("图表初始化完成");
        
        setIsLoaded(true);
        
        const handleResize = () => {
          chart.resize();
        };
        
        window.addEventListener('resize', handleResize);
        
        return () => {
          chart.dispose();
          window.removeEventListener('resize', handleResize);
        };
      } catch (error) {
        console.error("初始化图表出错:", error);
      }
    }, 500);  // 增加延迟，确保DOM已加载
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="p-4">
      <header className="container py-4">
        <h1 className="text-3xl font-bold" style={{ color: '#FF00FF' }}>测试页面</h1>
        <p className="mt-4" style={{ color: '#FFFFFF' }}>
          这是一个简单的测试页面，用于确认组件渲染和图表功能是否正常
        </p>
        <div className="mt-2">
          <p>组件已加载: {isLoaded ? '是' : '否'}</p>
        </div>
      </header>

      <main className="container mt-4">
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#2D2D2D', 
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 className="text-xl mb-4" style={{ color: '#FFFFFF' }}>测试图表</h2>
          
          {/* 图表容器 */}
          <div 
            ref={chartRef} 
            style={{ 
              width: '100%', 
              height: '400px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '4px'
            }} 
          />
          
          <div className="mt-4 p-4" style={{ 
            backgroundColor: '#1E1E1E', 
            borderRadius: '4px',
            color: '#FFFFFF'
          }}>
            <p>图表应该在这个容器中显示。如果没有显示，请检查浏览器控制台的错误信息。</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default TestChart; 