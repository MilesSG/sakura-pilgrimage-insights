import { useLayoutEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import type { EChartsOption, RadarSeriesOption, LineSeriesOption, HeatmapSeriesOption } from 'echarts';
import { motion } from 'framer-motion';

// 动漫圣地巡礼分析引擎
function SparkAnalysis() {
  const chartRefs = {
    factor: useRef<HTMLDivElement>(null),
    trend: useRef<HTMLDivElement>(null),
    sentiment: useRef<HTMLDivElement>(null)
  };

  const [activeTab] = useState('全部分析');

  // 初始化图表
  const initChart = (container: HTMLDivElement, options: EChartsOption) => {
    try {
      // 确保容器有正确的尺寸
      container.style.width = '100%';
      container.style.height = '400px';
      
      const chart = echarts.init(container, undefined, {
        renderer: 'canvas',
        devicePixelRatio: window.devicePixelRatio
      });
      
      chart.setOption(options);
      return chart;
    } catch (error) {
      console.error('Failed to initialize chart:', error);
      return null;
    }
  };

  // 使用 useLayoutEffect 确保在 DOM 更新后立即初始化图表
  useLayoutEffect(() => {
    const charts: (echarts.ECharts | null)[] = [];
    
    // 等待一帧以确保 DOM 完全准备好
    requestAnimationFrame(() => {
      // 初始化影响因素图表
      if (chartRefs.factor.current) {
        // 影响因素数据
        const factorData = [
          { name: '原作知名度', value: 92, group: '内容特性' },
          { name: '场景美学价值', value: 89, group: '内容特性' },
          { name: '情感共鸣程度', value: 86, group: '内容特性' },
          { name: '实景匹配程度', value: 79, group: '实景对比' },
          { name: '地标识别难度', value: 68, group: '实景对比' },
          { name: '拍摄便利性', value: 72, group: '实景对比' },
          { name: '交通便利度', value: 83, group: '地理特性' },
          { name: '周边配套完善度', value: 77, group: '地理特性' },
          { name: '地区开放程度', value: 81, group: '地理特性' },
          { name: '社交媒体曝光度', value: 94, group: '传播特性' },
          { name: '经典引用次数', value: 76, group: '传播特性' },
          { name: '官方推广投入', value: 73, group: '传播特性' }
        ];
        
        // 按组分类
        const groups = Array.from(new Set(factorData.map(item => item.group)));
        
        // 创建组内数据
        const seriesData = groups.map((group, index) => {
          const groupData = factorData.filter(item => item.group === group);
          
          return {
            name: group,
            type: 'radar',
            symbol: 'circle',
            symbolSize: 6,
            itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(0, 0, 0, 0.3)'
            },
            areaStyle: {
              opacity: 0.3
            },
            data: [{
              value: groupData.map(item => item.value),
              name: group,
              areaStyle: {
                color: new echarts.graphic.RadialGradient(0.5, 0.5, 1, [
                  {
                    color: index === 0 ? 'rgba(255, 0, 255, 0.8)' : 
                           index === 1 ? 'rgba(0, 255, 255, 0.8)' : 
                           index === 2 ? 'rgba(0, 255, 0, 0.8)' : 'rgba(255, 255, 0, 0.8)',
                    offset: 0
                  },
                  {
                    color: index === 0 ? 'rgba(255, 0, 255, 0.1)' : 
                           index === 1 ? 'rgba(0, 255, 255, 0.1)' : 
                           index === 2 ? 'rgba(0, 255, 0, 0.1)' : 'rgba(255, 255, 0, 0.1)',
                    offset: 1
                  }
                ])
              }
            }]
          };
        });
        
        // 雷达图指示器
        const indicators = factorData.map(item => ({
          name: item.name,
          max: 100
        }));

        const radarOption: EChartsOption = {
          backgroundColor: 'transparent',
          color: ['#FF00FF', '#00FFFF', '#00FF00', '#FFFF00'],
          title: {
            text: '动漫圣地巡礼影响因素权重分析',
            left: 'center',
            top: 0,
            textStyle: {
              color: '#fff',
              fontSize: 16,
              fontWeight: 'normal'
            }
          },
          tooltip: {
            trigger: 'item',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            borderColor: '#333',
            textStyle: {
              color: '#fff'
            }
          },
          legend: {
            data: groups,
            top: 30,
            textStyle: {
              color: '#fff'
            }
          },
          radar: {
            indicator: indicators,
            shape: 'circle',
            splitNumber: 4,
            axisNameGap: 15,
            splitLine: {
              lineStyle: {
                color: 'rgba(255, 255, 255, 0.1)'
              }
            },
            splitArea: {
              show: true,
              areaStyle: {
                color: ['rgba(255, 255, 255, 0.02)', 'rgba(255, 255, 255, 0.05)']
              }
            },
            axisLine: {
              lineStyle: {
                color: 'rgba(255, 255, 255, 0.3)'
              }
            },
            axisName: {
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: 10
            }
          },
          series: seriesData as RadarSeriesOption[]
        };
        const chart = initChart(chartRefs.factor.current, radarOption);
        if (chart) charts.push(chart);
      }

      // 初始化趋势图表
      if (chartRefs.trend.current) {
        const trendOption: EChartsOption = {
          backgroundColor: 'transparent',
          title: {
            text: '圣地巡礼热度时间趋势分析',
            left: 'center',
            top: 0,
            textStyle: {
              color: '#fff',
              fontSize: 16,
              fontWeight: 'normal'
            }
          },
          tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            borderColor: '#333',
            textStyle: { color: '#fff' }
          },
          legend: {
            data: ['你的名字', '灌篮高手', '铃芽之旅', '催眠麦克风'],
            top: 30,
            textStyle: { color: '#fff' }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            top: '80',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['Q1 2021', 'Q2 2021', 'Q3 2021', 'Q4 2021',
                  'Q1 2022', 'Q2 2022', 'Q3 2022', 'Q4 2022',
                  'Q1 2023', 'Q2 2023', 'Q3 2023', 'Q4 2023'],
            axisLine: {
              lineStyle: { color: 'rgba(255, 255, 255, 0.2)' }
            },
            axisLabel: {
              color: 'rgba(255, 255, 255, 0.7)'
            }
          },
          yAxis: {
            type: 'value',
            splitLine: {
              lineStyle: { color: 'rgba(255, 255, 255, 0.1)' }
            },
            axisLabel: {
              color: 'rgba(255, 255, 255, 0.7)'
            }
          },
          series: [
            {
              name: '你的名字',
              type: 'line',
              data: [56, 62, 75, 89, 95, 92, 86, 79, 74, 68, 72, 76],
              smooth: true,
              lineStyle: { width: 2 },
              areaStyle: {
                opacity: 0.2,
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: 'rgba(255, 0, 255, 0.8)' },
                  { offset: 1, color: 'rgba(255, 0, 255, 0.1)' }
                ])
              }
            },
            {
              name: '灌篮高手',
              type: 'line',
              data: [25, 28, 32, 45, 58, 95, 128, 142, 136, 125, 115, 105],
              smooth: true,
              lineStyle: { width: 2 },
              areaStyle: {
                opacity: 0.2,
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: 'rgba(0, 255, 255, 0.8)' },
                  { offset: 1, color: 'rgba(0, 255, 255, 0.1)' }
                ])
              }
            },
            {
              name: '铃芽之旅',
              type: 'line',
              data: [0, 0, 0, 0, 0, 0, 0, 0, 15, 85, 165, 152],
              smooth: true,
              lineStyle: { width: 2 },
              areaStyle: {
                opacity: 0.2,
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: 'rgba(0, 255, 0, 0.8)' },
                  { offset: 1, color: 'rgba(0, 255, 0, 0.1)' }
                ])
              }
            },
            {
              name: '催眠麦克风',
              type: 'line',
              data: [32, 38, 42, 48, 52, 58, 62, 65, 68, 64, 60, 56],
              smooth: true,
              lineStyle: { width: 2 },
              areaStyle: {
                opacity: 0.2,
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: 'rgba(255, 255, 0, 0.8)' },
                  { offset: 1, color: 'rgba(255, 255, 0, 0.1)' }
                ])
              }
            }
          ] as LineSeriesOption[]
        };
        const chart = initChart(chartRefs.trend.current, trendOption);
        if (chart) charts.push(chart);
      }

      // 初始化情感分析图表
      if (chartRefs.sentiment.current) {
        // 生成热力图数据
        const hours = ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00',
          '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
          '13:00', '14:00', '15:00', '16:00', '17:00', '18:00',
          '19:00', '20:00', '21:00', '22:00', '23:00'];
        
        const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
        
        const data = [];
        let max = 0;
        
        for (let i = 0; i < days.length; i++) {
          for (let j = 0; j < hours.length; j++) {
            const value = Math.floor(Math.random() * 100);
            max = Math.max(max, value);
            data.push([j, i, value]);
          }
        }

        const heatmapOption: EChartsOption = {
          backgroundColor: 'transparent',
          title: {
            text: '社交媒体情感分布热力图',
            left: 'center',
            top: 0,
            textStyle: {
              color: '#fff',
              fontSize: 16,
              fontWeight: 'normal'
            }
          },
          tooltip: {
            position: 'top',
            formatter: function (params: any) {
              return `${days[params.value[1]]} ${hours[params.value[0]]}<br>活跃度: ${params.value[2]}`;
            }
          },
          grid: {
            left: '10%',
            right: '10%',
            top: '15%',
            bottom: '10%'
          },
          xAxis: {
            type: 'category',
            data: hours,
            splitArea: {
              show: true
            },
            axisLabel: {
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: 10
            }
          },
          yAxis: {
            type: 'category',
            data: days,
            splitArea: {
              show: true
            },
            axisLabel: {
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: 10
            }
          },
          visualMap: {
            min: 0,
            max: max,
            calculable: true,
            orient: 'horizontal',
            left: 'center',
            bottom: '0%',
            textStyle: {
              color: '#fff'
            },
            inRange: {
              color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8']
            }
          },
          series: [{
            name: '情感分布',
            type: 'heatmap',
            data: data,
            label: {
              show: false
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }] as HeatmapSeriesOption[]
        };
        const chart = initChart(chartRefs.sentiment.current, heatmapOption);
        if (chart) charts.push(chart);
      }

      // 处理窗口大小变化
      const handleResize = () => {
        charts.forEach(chart => {
          if (chart) {
            try {
              chart.resize();
            } catch (e) {
              console.error('Error resizing chart:', e);
            }
          }
        });
      };

      window.addEventListener('resize', handleResize);

      // 清理函数
      return () => {
        window.removeEventListener('resize', handleResize);
        charts.forEach(chart => {
          if (chart) {
            try {
              chart.dispose();
            } catch (e) {
              console.error('Error disposing chart:', e);
            }
          }
        });
      };
    });
  }, []);

  return (
    <div className="p-4 min-h-screen bg-[#1a1a1a]">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="rounded-lg bg-[#2a2a2a] p-6 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-cyan-400">影响因素权重</h2>
          </div>
          <div 
            ref={chartRefs.factor}
            className="w-full h-[400px] bg-[#2a2a2a]"
            style={{ minHeight: '400px' }}
          />
        </div>

        <div className="rounded-lg bg-[#2a2a2a] p-6 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-pink-400">热度时间趋势</h2>
          </div>
          <div 
            ref={chartRefs.trend}
            className="w-full h-[400px] bg-[#2a2a2a]"
            style={{ minHeight: '400px' }}
          />
        </div>
      </div>

      <div className="rounded-lg bg-[#2a2a2a] p-6 shadow-lg mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-cyan-400">社交媒体情感分析</h2>
        </div>
        <div 
          ref={chartRefs.sentiment}
          className="w-full h-[400px] bg-[#2a2a2a]"
          style={{ minHeight: '400px' }}
        />
      </div>
    </div>
  );
}

export default SparkAnalysis; 