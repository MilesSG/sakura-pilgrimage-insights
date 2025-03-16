import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

function DebugRawChart() {
  const chartRef = useRef<HTMLDivElement>(null);

  // 最简单的副作用，仅使用内联样式和基本DOM操作
  useEffect(() => {
    console.log('[DebugRawChart] 组件挂载');
    
    const initChart = () => {
      console.log('[DebugRawChart] 开始初始化图表');
      
      if (!chartRef.current) {
        console.error('[DebugRawChart] 图表容器不存在');
        return;
      }
      
      console.log('[DebugRawChart] 找到图表容器');
      
      try {
        // 简单数据
        const data = [
          { name: '选项A', value: 20 },
          { name: '选项B', value: 40 },
          { name: '选项C', value: 60 }
        ];
        
        // 创建图表实例
        const chart = echarts.init(chartRef.current);
        console.log('[DebugRawChart] 创建了echarts实例');
        
        // 简单配置
        const option = {
          title: {
            text: '超级简单图表测试',
            left: 'center',
            textStyle: { color: 'red', fontSize: 20 }
          },
          tooltip: {
            trigger: 'item'
          },
          series: [
            {
              name: '基础数据',
              type: 'pie',
              radius: '50%',
              data: data,
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        };
        
        // 设置选项
        chart.setOption(option);
        console.log('[DebugRawChart] 设置了图表选项');
        
        // 清理函数
        return () => {
          console.log('[DebugRawChart] 清理图表实例');
          chart.dispose();
        };
      } catch (error) {
        console.error('[DebugRawChart] 图表初始化错误:', error);
      }
    };
    
    // 使用延时确保DOM已经渲染
    const timer = setTimeout(() => {
      initChart();
    }, 1000);
    
    return () => {
      clearTimeout(timer);
      console.log('[DebugRawChart] 组件卸载');
    };
  }, []);

  return (
    <div style={{
      padding: '30px',
      backgroundColor: '#000000',
      color: '#FFFFFF',
      fontFamily: 'Arial, sans-serif',
      height: '100vh',
      width: '100%'
    }}>
      <h1 style={{
        fontSize: '24px',
        color: '#00FFFF',
        textAlign: 'center',
        marginBottom: '20px'
      }}>
        基础调试页面 - 原生渲染测试
      </h1>
      
      <p style={{
        fontSize: '16px',
        color: '#FFFF00',
        textAlign: 'center',
        marginBottom: '30px'
      }}>
        这个页面使用纯HTML和内联样式，没有依赖任何外部CSS
      </p>
      
      <div style={{
        padding: '20px',
        backgroundColor: '#333333',
        borderRadius: '10px',
        border: '2px solid #00FFFF',
        width: '80%',
        margin: '0 auto'
      }}>
        <h2 style={{
          fontSize: '18px',
          color: '#FFFFFF',
          marginBottom: '15px'
        }}>
          ECharts测试区域
        </h2>
        
        {/* 图表容器 */}
        <div 
          ref={chartRef} 
          style={{
            width: '100%',
            height: '400px',
            backgroundColor: '#222222',
            border: '1px dashed #FF00FF',
            borderRadius: '5px'
          }}
        />
        
        <div style={{
          marginTop: '15px',
          fontSize: '14px',
          color: '#AAAAAA'
        }}>
          如果图表未显示，请检查控制台日志。
        </div>
      </div>
      
      <button
        onClick={() => alert('图表容器状态: ' + (chartRef.current ? '已找到' : '未找到'))}
        style={{
          display: 'block',
          margin: '20px auto',
          padding: '10px 20px',
          backgroundColor: '#FF00FF',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '16px'
        }}
      >
        检查图表容器
      </button>
    </div>
  );
}

export default DebugRawChart; 