import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import * as echarts from 'echarts';
import { EChartsOption } from 'echarts';

// 模拟数据
const mockTrendData = {
  dates: ['2023-01', '2023-02', '2023-03', '2023-04', '2023-05', '2023-06', 
          '2023-07', '2023-08', '2023-09', '2023-10', '2023-11', '2023-12'],
  series: [
    {
      name: '灌篮高手',
      data: [120, 132, 101, 134, 190, 230, 410, 720, 500, 444, 390, 340]
    },
    {
      name: '你的名字',
      data: [220, 182, 191, 234, 290, 330, 310, 302, 341, 374, 390, 450]
    },
    {
      name: '名侦探柯南',
      data: [150, 232, 201, 154, 190, 330, 410, 400, 450, 420, 390, 350]
    },
    {
      name: '千与千寻',
      data: [320, 332, 301, 334, 350, 330, 320, 315, 310, 330, 350, 340]
    },
    {
      name: '少女与战车',
      data: [80, 90, 101, 104, 190, 230, 210, 240, 200, 230, 240, 250]
    }
  ]
};

const mockSentimentData = [
  { name: '正面', value: 60, itemStyle: { color: '#39FF14' } },
  { name: '中性', value: 30, itemStyle: { color: '#00FFFF' } },
  { name: '负面', value: 10, itemStyle: { color: '#FF00FF' } }
];

const mockPlatformData = [
  { name: '微博', value: 40, itemStyle: { color: '#FF00FF' } },
  { name: '哔哩哔哩', value: 30, itemStyle: { color: '#00FFFF' } },
  { name: '小红书', value: 20, itemStyle: { color: '#9D00FF' } },
  { name: '抖音', value: 10, itemStyle: { color: '#39FF14' } }
];

const mockFactorsData = [
  { name: '动漫人气', max: 100, value: 90 },
  { name: '场景美观度', max: 100, value: 85 },
  { name: '交通便利性', max: 100, value: 65 },
  { name: '旅游设施', max: 100, value: 70 },
  { name: '当地推广', max: 100, value: 80 },
  { name: '社交媒体曝光', max: 100, value: 95 }
];

function DataInsights() {
  const trendChartRef = useRef<HTMLDivElement>(null);
  const sentimentChartRef = useRef<HTMLDivElement>(null);
  const platformChartRef = useRef<HTMLDivElement>(null);
  const factorsChartRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'trends' | 'factors'>('trends');

  // 初始化趋势图表
  useEffect(() => {
    if (!trendChartRef.current) return;
    
    const chart = echarts.init(trendChartRef.current);
    
    const option: EChartsOption = {
      backgroundColor: 'transparent',
      title: {
        text: '动漫圣地热度趋势',
        textStyle: {
          color: '#fff',
          fontWeight: 'normal'
        },
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      legend: {
        data: mockTrendData.series.map(item => item.name),
        textStyle: {
          color: '#ccc'
        },
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
        data: mockTrendData.dates,
        axisLine: {
          lineStyle: {
            color: '#444'
          }
        },
        axisLabel: {
          color: '#ccc'
        }
      },
      yAxis: {
        type: 'value',
        axisLine: {
          lineStyle: {
            color: '#444'
          }
        },
        axisLabel: {
          color: '#ccc'
        },
        splitLine: {
          lineStyle: {
            color: '#333'
          }
        }
      },
      series: mockTrendData.series.map(item => ({
        name: item.name,
        type: 'line',
        stack: 'Total',
        emphasis: {
          focus: 'series'
        },
        showSymbol: false,
        areaStyle: {
          opacity: 0.2
        },
        lineStyle: {
          width: 2
        },
        data: item.data
      }))
    };
    
    chart.setOption(option);
    
    const handleResize = () => {
      chart.resize();
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      chart.dispose();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // 初始化情感分析图表
  useEffect(() => {
    if (!sentimentChartRef.current) return;
    
    const chart = echarts.init(sentimentChartRef.current);
    
    const option: EChartsOption = {
      backgroundColor: 'transparent',
      title: {
        text: '圣地讨论情感分析',
        textStyle: {
          color: '#fff',
          fontWeight: 'normal'
        },
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      series: [
        {
          name: '情感分布',
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['50%', '60%'],
          data: mockSentimentData,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          label: {
            color: '#fff'
          }
        }
      ]
    };
    
    chart.setOption(option);
    
    const handleResize = () => {
      chart.resize();
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      chart.dispose();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // 初始化平台分布图表
  useEffect(() => {
    if (!platformChartRef.current) return;
    
    const chart = echarts.init(platformChartRef.current);
    
    const option: EChartsOption = {
      backgroundColor: 'transparent',
      title: {
        text: '数据来源平台分布',
        textStyle: {
          color: '#fff',
          fontWeight: 'normal'
        },
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      series: [
        {
          name: '平台分布',
          type: 'pie',
          radius: '60%',
          center: ['50%', '60%'],
          data: mockPlatformData,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          label: {
            color: '#fff'
          }
        }
      ]
    };
    
    chart.setOption(option);
    
    const handleResize = () => {
      chart.resize();
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      chart.dispose();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // 初始化影响因素雷达图
  useEffect(() => {
    if (!factorsChartRef.current) return;
    
    const chart = echarts.init(factorsChartRef.current);
    
    const option: EChartsOption = {
      backgroundColor: 'transparent',
      title: {
        text: '圣地巡礼影响因素',
        textStyle: {
          color: '#fff',
          fontWeight: 'normal'
        },
        left: 'center'
      },
      tooltip: {},
      radar: {
        indicator: mockFactorsData,
        shape: 'circle',
        splitNumber: 5,
        axisName: {
          color: '#ccc'
        },
        splitLine: {
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.2)'
          }
        },
        splitArea: {
          show: false
        },
        axisLine: {
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.2)'
          }
        }
      },
      series: [
        {
          name: '影响因素权重',
          type: 'radar',
          data: [
            {
              value: mockFactorsData.map(item => item.value),
              name: '影响权重',
              areaStyle: {
                color: 'rgba(0, 255, 255, 0.3)'
              },
              lineStyle: {
                color: 'rgba(0, 255, 255, 1)',
                width: 2
              },
              symbol: 'circle',
              symbolSize: 6,
              itemStyle: {
                color: '#00FFFF'
              }
            }
          ]
        }
      ]
    };
    
    chart.setOption(option);
    
    const handleResize = () => {
      chart.resize();
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      chart.dispose();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="p-4">
      <header className="container mx-auto py-4">
        <h1 className="text-3xl font-bold neon-text-purple">数据洞察驾驶舱</h1>
        <p className="mt-2 text-gray-400">
          深入分析动漫圣地巡礼数据，挖掘关键趋势与影响因素
        </p>
      </header>

      <main className="container mx-auto mt-4">
        {/* 标签页切换 */}
        <div className="flex border-b border-gray-700 mb-6">
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === 'trends'
                ? 'text-neon-purple border-b-2 border-neon-purple'
                : 'text-gray-400 hover:text-gray-200'
            }`}
            onClick={() => setActiveTab('trends')}
          >
            趋势分析
          </button>
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === 'factors'
                ? 'text-neon-green border-b-2 border-neon-green'
                : 'text-gray-400 hover:text-gray-200'
            }`}
            onClick={() => setActiveTab('factors')}
          >
            影响因素
          </button>
        </div>

        {/* 趋势分析内容 */}
        {activeTab === 'trends' && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="card bg-dark-elevated mb-6"
            >
              <div ref={trendChartRef} className="w-full h-[400px]" />
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="card bg-dark-elevated"
              >
                <div ref={sentimentChartRef} className="w-full h-[300px]" />
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="card bg-dark-elevated"
              >
                <div ref={platformChartRef} className="w-full h-[300px]" />
              </motion.div>
            </div>
          </>
        )}

        {/* 影响因素内容 */}
        {activeTab === 'factors' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="card bg-dark-elevated"
          >
            <div ref={factorsChartRef} className="w-full h-[500px]" />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              {mockFactorsData.map((factor, index) => (
                <div key={index} className="bg-dark-surface p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-2">{factor.name}</h3>
                  <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div 
                      className="h-2.5 rounded-full" 
                      style={{ 
                        width: `${factor.value}%`,
                        background: `linear-gradient(90deg, #00FFFF, #39FF14)` 
                      }} 
                    />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-gray-400">0</span>
                    <span className="text-xs text-gray-400">{factor.value}</span>
                    <span className="text-xs text-gray-400">{factor.max}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}

export default DataInsights; 