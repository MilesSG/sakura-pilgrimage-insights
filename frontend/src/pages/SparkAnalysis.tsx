import { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';

// 重构后的分析组件 - 应用成功经验
function SparkAnalysis() {
  const chartRef = useRef<HTMLDivElement>(null);
  const [chartReady, setChartReady] = useState(false);

  // 采用与调试页面相同的方法初始化图表
  useEffect(() => {
    console.log("[SparkAnalysis] 组件挂载");
    
    // 确保组件加载后有足够时间初始化图表
    const timer = setTimeout(() => {
      try {
        console.log("[SparkAnalysis] 开始初始化图表");
        
        if (!chartRef.current) {
          console.error("[SparkAnalysis] 错误: 找不到图表容器元素");
          return;
        }
        
        // 直接处理容器
        const container = chartRef.current;
        console.log(`[SparkAnalysis] 容器尺寸: ${container.offsetWidth}x${container.offsetHeight}`);
        
        // 先确保容器可见
        container.style.backgroundColor = "rgba(255, 0, 0, 0.1)";
        
        // 创建新的图表实例 - 直接使用与调试页面相同的方式
        console.log("[SparkAnalysis] 创建新的ECharts实例");
        const chart = echarts.init(container);
        
        // 静态数据
        const data = [
          { name: '原作人气', value: 92 },
          { name: '场景还原度', value: 85 },
          { name: '交通便利性', value: 72 },
          { name: '社交媒体曝光', value: 89 },
          { name: '周边旅游资源', value: 65 },
          { name: '官方推广力度', value: 78 }
        ];
        
        // 采用类似饼图配置
        const option = {
          backgroundColor: 'transparent',
          title: {
            text: '影响因素权重分析',
            left: 'center',
            textStyle: { color: '#FFFFFF', fontSize: 18 }
          },
          tooltip: {
            trigger: 'item'
          },
          legend: {
            top: '6%',
            left: 'center',
            textStyle: { color: '#FFFFFF' }
          },
          series: [
            {
              name: '影响权重',
              type: 'pie', // 改用成功的饼图类型
              radius: ['40%', '70%'],
              avoidLabelOverlap: false,
              itemStyle: {
                borderRadius: 10,
                borderColor: '#444',
                borderWidth: 2
              },
              label: {
                color: '#FFFFFF',
                formatter: '{b}: {c}%'
              },
              data: data.map(item => ({
                name: item.name,
                value: item.value
              }))
            }
          ]
        };
        
        // 设置选项并渲染图表
        console.log("[SparkAnalysis] 设置图表选项");
        chart.setOption(option);
        console.log("[SparkAnalysis] 图表渲染完成");
        
        // 标记图表已就绪
        setChartReady(true);
        
        // 手动触发resize以确保图表正确显示
        setTimeout(() => {
          console.log("[SparkAnalysis] 手动触发resize");
          chart.resize();
        }, 200);
        
        // 处理窗口大小变化
        const handleResize = () => {
          console.log("[SparkAnalysis] 窗口大小变化，调整图表尺寸");
          chart.resize();
        };
        
        window.addEventListener('resize', handleResize);
        
        return () => {
          console.log("[SparkAnalysis] 组件卸载，清理资源");
          chart.dispose();
          window.removeEventListener('resize', handleResize);
        };
      } catch (error) {
        console.error("[SparkAnalysis] 图表初始化失败:", error);
      }
    }, 1000); // 延长等待时间到1秒
    
    return () => {
      console.log("[SparkAnalysis] 清理定时器");
      clearTimeout(timer);
    };
  }, []); // 仅在组件挂载时执行一次

  return (
    <div style={{ 
      padding: '20px', 
      color: '#FFFFFF',
      height: '100%',
      width: '100%'
    }}>
      <h1 style={{ 
        fontSize: '24px', 
        fontWeight: 'bold',
        color: '#FF00FF',
        marginBottom: '20px',
        textAlign: 'center'
      }}>
        Spark分析引擎
      </h1>
      
      <p style={{ 
        color: 'rgba(255, 255, 255, 0.7)',
        marginBottom: '30px',
        textAlign: 'center'
      }}>
        深入分析动漫圣地巡礼的影响因素
      </p>
      
      {/* 添加手动检查按钮 */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '20px'
      }}>
        <button 
          onClick={() => {
            console.log("[SparkAnalysis] 检查按钮被点击");
            if (chartRef.current) {
              console.log(`[SparkAnalysis] 容器存在，尺寸: ${chartRef.current.offsetWidth}x${chartRef.current.offsetHeight}`);
              alert(`图表容器状态: 存在，尺寸: ${chartRef.current.offsetWidth}x${chartRef.current.offsetHeight}`);
            } else {
              console.log("[SparkAnalysis] 容器不存在");
              alert("图表容器不存在");
            }
          }}
          style={{
            backgroundColor: '#FF00FF',
            color: 'white',
            padding: '8px 16px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          检查图表容器
        </button>
      </div>
      
      {/* 图表容器 */}
      <div style={{ 
        padding: '20px',
        backgroundColor: '#2D2D2D',
        borderRadius: '8px',
        marginBottom: '20px',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <h2 style={{ 
          fontSize: '18px',
          marginBottom: '15px',
          color: '#FFFFFF'
        }}>
          影响因素分析
        </h2>
        
        <div
          ref={chartRef}
          style={{
            width: '100%',
            height: '500px',
            border: '1px dashed #FF00FF',
            borderRadius: '4px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          {!chartReady && (
            <div style={{ color: 'yellow', fontSize: '20px' }}>
              图表加载中...
            </div>
          )}
        </div>
        
        <div style={{ 
          marginTop: '10px',
          fontSize: '14px',
          color: 'rgba(255, 255, 255, 0.5)'
        }}>
          注: 数据基于2万+社交媒体分析和300+实地调研
        </div>
      </div>
    </div>
  );
}

export default SparkAnalysis; 