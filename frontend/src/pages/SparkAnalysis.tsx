import { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import { motion } from 'framer-motion';

// 动漫圣地巡礼分析引擎
function SparkAnalysis() {
  // 创建多个图表的引用
  const factorChartRef = useRef<HTMLDivElement>(null);
  const trendChartRef = useRef<HTMLDivElement>(null);
  const sentimentRef = useRef<HTMLDivElement>(null);
  
  // 追踪加载状态
  const [factorChartReady, setFactorChartReady] = useState(false);
  const [trendChartReady, setTrendChartReady] = useState(false);
  const [sentimentChartReady, setSentimentChartReady] = useState(false);
  const [activeTab, setActiveTab] = useState('全部分析');
  
  // 动画变体
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  // 初始化影响因素权重图表
  useEffect(() => {
    if (!factorChartRef.current) return;
    
    const initFactorChart = () => {
      const chart = echarts.init(factorChartRef.current);
      
      // 丰富的影响因素数据
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
      
      // 配置雷达图
      const option = {
        backgroundColor: 'transparent',
        color: ['#FF00FF', '#00FFFF', '#00FF00', '#FFFF00'],
        title: {
          text: '动漫圣地巡礼影响因素权重分析',
          left: 'center',
          top: 0,
          textStyle: {
            color: '#fff',
            fontSize: 18,
            fontWeight: 'normal',
            textShadow: '0 0 5px #FF00FF'
          }
        },
        tooltip: {
          trigger: 'item',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          borderColor: '#333',
          textStyle: {
            color: '#fff'
          },
          formatter: (params: any) => {
            const { name, value } = params;
            let html = `<div style="font-weight:bold;margin-bottom:5px;text-align:center;">${name}</div>`;
            
            factorData.filter(item => item.group === name).forEach((item, index) => {
              const val = value[index];
              const color = val > 85 ? '#00FF00' : val > 75 ? '#FFFF00' : '#FF6666';
              html += `<div style="display:flex;justify-content:space-between;margin:3px 0;">
                <span>${item.name}:</span> 
                <span style="color:${color};font-weight:bold;">${val}%</span>
              </div>`;
            });
            
            return html;
          }
        },
        legend: {
          data: groups,
          top: 30,
          left: 'center',
          textStyle: {
            color: '#fff',
            fontSize: 12
          },
          selected: {
            '内容特性': true,
            '实景对比': true,
            '地理特性': true,
            '传播特性': true
          },
          itemWidth: 12,
          itemHeight: 12,
          itemGap: 20
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
        series: seriesData
      };
      
      // 更新图表
      chart.setOption(option);
      setFactorChartReady(true);
      
      // 窗口大小调整处理
      window.addEventListener('resize', () => {
        chart.resize();
      });
      
      // 清理函数
      return () => {
        chart.dispose();
        window.removeEventListener('resize', () => {
          chart.resize();
        });
      };
    };
    
    // 延迟加载以确保DOM已渲染
    const timer = setTimeout(() => {
      initFactorChart();
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  // 初始化时间趋势分析图表
  useEffect(() => {
    if (!trendChartRef.current) return;
    
    const initTrendChart = () => {
      const chart = echarts.init(trendChartRef.current);
      
      // 季度数据
      const quarters = [
        'Q1 2021', 'Q2 2021', 'Q3 2021', 'Q4 2021',
        'Q1 2022', 'Q2 2022', 'Q3 2022', 'Q4 2022',
        'Q1 2023', 'Q2 2023', 'Q3 2023', 'Q4 2023'
      ];
      
      // 不同作品的趋势数据
      const seriesData = [
        {
          name: '你的名字',
          data: [56, 62, 75, 89, 95, 92, 86, 79, 74, 68, 72, 76],
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(255, 0, 255, 0.8)' },
            { offset: 1, color: 'rgba(255, 0, 255, 0.1)' }
          ]),
          areaStyle: { opacity: 0.2 }
        },
        {
          name: '灌篮高手',
          data: [25, 28, 32, 45, 58, 95, 128, 142, 136, 125, 115, 105],
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(0, 255, 255, 0.8)' },
            { offset: 1, color: 'rgba(0, 255, 255, 0.1)' }
          ]),
          areaStyle: { opacity: 0.2 }
        },
        {
          name: '铃芽之旅',
          data: [0, 0, 0, 0, 0, 0, 0, 0, 15, 85, 165, 152],
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(0, 255, 0, 0.8)' },
            { offset: 1, color: 'rgba(0, 255, 0, 0.1)' }
          ]),
          areaStyle: { opacity: 0.2 }
        },
        {
          name: '催眠麦克风',
          data: [32, 38, 42, 48, 52, 58, 62, 65, 68, 64, 60, 56],
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(255, 255, 0, 0.8)' },
            { offset: 1, color: 'rgba(255, 255, 0, 0.1)' }
          ]),
          areaStyle: { opacity: 0.2 }
        }
      ];
      
      // 事件标记
      const markPoints = [
        { coord: [3, 89], name: '电影周年', value: '周年' },
        { coord: [5, 95], name: '周边展览', value: '展览' },
        { coord: [7, 142], name: '电影上映', value: '上映' },
        { coord: [10, 165], name: '铃芽热潮', value: '热潮' }
      ];
      
      // 配置趋势图
      const option = {
        backgroundColor: 'transparent',
        title: {
          text: '圣地巡礼热度时间趋势分析',
          left: 'center',
          top: 0,
          textStyle: {
            color: '#fff',
            fontSize: 16,
            fontWeight: 'normal',
            textShadow: '0 0 5px #00FFFF'
          }
        },
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          borderColor: '#333',
          textStyle: { color: '#fff' }
        },
        legend: {
          data: seriesData.map(item => item.name),
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
          data: quarters,
          axisLine: {
            lineStyle: { color: 'rgba(255, 255, 255, 0.2)' }
          },
          axisLabel: {
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: 10
          }
        },
        yAxis: {
          type: 'value',
          name: '热度指数',
          nameTextStyle: {
            color: 'rgba(255, 255, 255, 0.5)'
          },
          splitLine: {
            lineStyle: { color: 'rgba(255, 255, 255, 0.1)' }
          },
          axisLabel: {
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: 10
          }
        },
        series: seriesData.map(item => ({
          name: item.name,
          type: 'line',
          stack: 'Total',
          smooth: true,
          lineStyle: {
            width: 2,
            color: item.color
          },
          symbol: 'circle',
          symbolSize: 6,
          showSymbol: false,
          areaStyle: {
            color: item.color,
            opacity: 0.1
          },
          emphasis: {
            focus: 'series',
            blurScope: 'coordinateSystem'
          },
          data: item.data,
          markPoint: {
            symbol: 'pin',
            symbolSize: 40,
            itemStyle: {
              color: 'rgba(255, 255, 255, 0.2)'
            },
            label: {
              color: '#fff',
              fontSize: 10
            },
            data: item.name === '你的名字' ? [markPoints[0], markPoints[1]] :
                 item.name === '灌篮高手' ? [markPoints[2]] :
                 item.name === '铃芽之旅' ? [markPoints[3]] : []
          },
          markLine: {
            symbol: ['none', 'none'],
            label: { show: false },
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.3)',
              type: 'dashed'
            },
            data: [
              { type: 'average', name: '平均值' }
            ]
          }
        }))
      };
      
      // 更新图表
      chart.setOption(option);
      setTrendChartReady(true);
      
      // 添加动画效果
      seriesData.forEach((item, index) => {
        setTimeout(() => {
          chart.dispatchAction({
            type: 'highlight',
            seriesIndex: index
          });
          
          setTimeout(() => {
            chart.dispatchAction({
              type: 'downplay',
              seriesIndex: index
            });
          }, 300);
        }, index * 200);
      });
      
      // 窗口大小调整处理
      window.addEventListener('resize', () => {
        chart.resize();
      });
      
      // 清理函数
      return () => {
        chart.dispose();
        window.removeEventListener('resize', () => {
          chart.resize();
        });
      };
    };
    
    // 延迟加载以确保DOM已渲染
    const timer = setTimeout(() => {
      initTrendChart();
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // 初始化情感分析热力图
  useEffect(() => {
    if (!sentimentRef.current) return;
    
    const initSentimentChart = () => {
      const chart = echarts.init(sentimentRef.current);
      
      // 情感分析数据
      const hours = ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00',
        '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
        '13:00', '14:00', '15:00', '16:00', '17:00', '18:00',
        '19:00', '20:00', '21:00', '22:00', '23:00'];
      
      const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
      
      // 生成随机热力图数据
      const data = [];
      let max = 0;
      
      // 工作日白天活跃
      for (let i = 0; i < days.length; i++) {
        // 工作日
        if (i < 5) {
          // 低活跃时段 (深夜和凌晨)
          for (let j = 0; j < 7; j++) {
            const value = Math.floor(Math.random() * 30);
            max = Math.max(max, value);
            data.push([j, i, value, getRandomSentiment(value, 30)]);
          }
          
          // 中等活跃时段 (上午和下午)
          for (let j = 7; j < 18; j++) {
            const value = Math.floor(Math.random() * 40) + 40;
            max = Math.max(max, value);
            data.push([j, i, value, getRandomSentiment(value, 80)]);
          }
          
          // 高活跃时段 (晚上)
          for (let j = 18; j < 24; j++) {
            const value = Math.floor(Math.random() * 40) + 60;
            max = Math.max(max, value);
            data.push([j, i, value, getRandomSentiment(value, 100)]);
          }
        } 
        // 周末
        else {
          // 周末晚睡晚起
          for (let j = 0; j < 9; j++) {
            const value = Math.floor(Math.random() * 20);
            max = Math.max(max, value);
            data.push([j, i, value, getRandomSentiment(value, 20)]);
          }
          
          // 周末全天候高活跃
          for (let j = 9; j < 24; j++) {
            const value = Math.floor(Math.random() * 30) + 70;
            max = Math.max(max, value);
            data.push([j, i, value, getRandomSentiment(value, 100)]);
          }
        }
      }
      
      // 随机生成情感类型
      function getRandomSentiment(value: number, maxValue: number): string {
        // 数值越高，积极情感概率越大
        const ratio = value / maxValue;
        const rand = Math.random();
        
        if (rand < ratio * 0.8) {
          return '正面';
        } else if (rand < ratio * 0.9) {
          return '中性';
        } else {
          return '负面';
        }
      }
      
      // 热力图配置
      const option = {
        backgroundColor: 'transparent',
        title: {
          text: '社交媒体情感分布热力图',
          left: 'center',
          top: 0,
          textStyle: {
            color: '#fff',
            fontSize: 16,
            fontWeight: 'normal',
            textShadow: '0 0 5px #00FFFF'
          }
        },
        tooltip: {
          position: 'top',
          formatter: function (params: any): string {
            return `<div style="font-weight:bold;margin-bottom:3px;">${days[params.value[1]]} ${hours[params.value[0]]}</div>` +
              `<div>活跃度: <span style="font-weight:bold;color:#00FFFF;">${params.value[2]}</span></div>` +
              `<div>情感: <span style="font-weight:bold;color:${
                params.value[3] === '正面' ? '#00FF00' : 
                params.value[3] === '负面' ? '#FF0066' : '#FFFF00'
              };">${params.value[3]}</span></div>`;
          }
        },
        grid: {
          left: '10%',
          right: '15%',
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
          },
          axisLine: {
            show: false
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
          },
          axisLine: {
            show: false
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
            color: ['#052061', '#0570b0', '#3690c0', '#74a9cf', '#a6bddb']
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
          },
          itemStyle: {
            borderColor: '#151515',
            borderWidth: 1
          }
        }]
      };
      
      // 更新图表
      chart.setOption(option);
      setSentimentChartReady(true);
      
      // 添加高亮动画效果
      setTimeout(() => {
        // 随机选择几个点高亮
        const highlights = [
          [19, 2], [20, 3], [21, 4], [21, 5], [20, 6]
        ];
        
        highlights.forEach((coords, idx) => {
          setTimeout(() => {
            chart.dispatchAction({
              type: 'highlight',
              seriesIndex: 0,
              dataIndex: coords[0] * 7 + coords[1]
            });
            
            setTimeout(() => {
              chart.dispatchAction({
                type: 'downplay',
                seriesIndex: 0,
                dataIndex: coords[0] * 7 + coords[1]
              });
            }, 300);
          }, idx * 200);
        });
      }, 1500);
      
      // 窗口大小调整处理
      window.addEventListener('resize', () => {
        chart.resize();
      });
      
      // 清理函数
      return () => {
        chart.dispose();
        window.removeEventListener('resize', () => {
          chart.resize();
        });
      };
    };
    
    // 延迟加载以确保DOM已渲染
    const timer = setTimeout(() => {
      initSentimentChart();
    }, 1200);
    
    return () => clearTimeout(timer);
  }, []);
  
  // 导出分析报告
  const exportReport = () => {
    alert('已生成分析报告，即将下载');
  };
  
  // 数据集选择处理
  const [datasetOptions, setDatasetOptions] = useState([
    { id: 'all', label: '全部数据集', selected: true },
    { id: 'recent', label: '最近30天', selected: false },
    { id: 'popular', label: '热门作品', selected: false },
    { id: 'trending', label: '热度上升', selected: false }
  ]);
  
  const toggleDataset = (id: string) => {
    setDatasetOptions(prev => 
      prev.map(option => ({
        ...option,
        selected: option.id === id
      }))
    );
  };

  // Tab切换控制器
  const tabs = ['全部分析', '知名动漫', '时间分析', '地域热度', '社交情感'];

  return (
    <motion.div 
      className="p-4 text-white"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* 页面标题 */}
      <motion.div 
        className="text-center mb-6" 
        variants={itemVariants}
      >
        <h1 className="text-3xl font-bold neon-text-blue mb-2">Spark分析引擎</h1>
        <p className="text-gray-400">基于大数据分析的动漫圣地巡礼深度洞察</p>
      </motion.div>
      
      {/* 分析选项卡 */}
      <motion.div 
        className="flex justify-center mb-6 overflow-x-auto"
        variants={itemVariants}
      >
        <div className="flex space-x-2 p-1 bg-dark-elevated rounded-lg">
          {tabs.map(tab => (
            <button
              key={tab}
              className={`px-4 py-2 rounded-md text-sm whitespace-nowrap transition-all duration-300 ${
                activeTab === tab 
                  ? 'bg-gradient-to-r from-neon-pink to-neon-blue text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </motion.div>
      
      {/* 过滤器行 */}
      <motion.div 
        className="flex flex-wrap justify-between items-center mb-6 bg-dark-base p-3 rounded-lg"
        variants={itemVariants}
      >
        <div className="flex items-center space-x-2 text-sm">
          <span className="text-gray-400">数据集:</span>
          <div className="flex space-x-1">
            {datasetOptions.map((option) => (
              <button 
                key={option.id}
                className={`px-3 py-1 rounded-full text-xs transition-all ${
                  option.selected 
                    ? 'bg-neon-blue text-black' 
                    : 'bg-dark-elevated text-gray-400 hover:text-white'
                }`}
                onClick={() => toggleDataset(option.id)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex space-x-3 mt-3 sm:mt-0">
          <button className="flex items-center space-x-1 text-xs text-neon-green bg-dark-elevated px-3 py-1 rounded-full">
            <span>时间范围</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <button className="flex items-center space-x-1 text-xs text-neon-pink bg-dark-elevated px-3 py-1 rounded-full">
            <span>数据源</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </motion.div>
      
      {/* 卡片网格 */}
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6"
        variants={containerVariants}
      >
        {/* 影响因素分析卡片 */}
        <motion.div 
          className="card bg-dark-elevated"
          variants={itemVariants}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold neon-text-blue">影响因素权重</h2>
            <div className="flex space-x-2">
              <button className="bg-dark-base px-2 py-1 rounded text-xs">
                过滤
              </button>
              <button className="bg-dark-base px-2 py-1 rounded text-xs">
                详情
              </button>
            </div>
          </div>
          
          <div 
            ref={factorChartRef}
            className="w-full h-[400px] relative"
          >
            {!factorChartReady && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center">
                  <div className="rounded-full h-12 w-12 bg-neon-blue mb-2 opacity-50"></div>
                  <div className="text-neon-blue">加载数据中...</div>
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-3 text-xs text-gray-500">
            * 基于对5000+用户调研和20万+社交媒体内容分析的数据建模
          </div>
        </motion.div>
        
        {/* 热度时间趋势卡片 */}
        <motion.div 
          className="card bg-dark-elevated"
          variants={itemVariants}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold neon-text-pink">热度时间趋势</h2>
            <div className="flex space-x-2">
              <button className="bg-dark-base px-2 py-1 rounded text-xs">
                筛选
              </button>
              <button className="bg-dark-base px-2 py-1 rounded text-xs">
                下载
              </button>
            </div>
          </div>
          
          <div 
            ref={trendChartRef}
            className="w-full h-[400px] relative"
          >
            {!trendChartReady && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center">
                  <div className="rounded-full h-12 w-12 bg-neon-pink mb-2 opacity-50"></div>
                  <div className="text-neon-pink">加载趋势数据...</div>
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-3 text-xs text-gray-500">
            * 基于网络搜索量、社交媒体提及和实地旅游人次综合计算的热度指数
          </div>
        </motion.div>
      </motion.div>
      
      {/* 其他分析内容 */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6"
        variants={containerVariants}
      >
        {/* 热度排名卡片 */}
        <motion.div 
          className="card bg-dark-elevated md:col-span-1"
          variants={itemVariants}
        >
          <h2 className="text-xl font-semibold mb-4 neon-text-green">巡礼地点热度排名</h2>
          
          <div className="space-y-3">
            {[
              { rank: 1, name: '镰仓高校前站', anime: '灌篮高手', score: 98, change: 'up' },
              { rank: 2, name: '须磨浦公园', anime: '你的名字', score: 95, change: 'down' },
              { rank: 3, name: '宫水神社', anime: '铃芽之旅', score: 92, change: 'up' },
              { rank: 4, name: '东京塔', anime: '名侦探柯南', score: 87, change: 'same' },
              { rank: 5, name: '姬路城', anime: '千与千寻', score: 85, change: 'up' }
            ].map(item => (
              <div key={item.rank} className="flex items-center bg-dark-base rounded-lg p-2 hover:bg-opacity-70 transition-all">
                <div className={`text-2xl font-bold w-10 text-center ${
                  item.rank === 1 ? 'neon-text-gold' : 
                  item.rank === 2 ? 'neon-text-silver' : 
                  item.rank === 3 ? 'neon-text-bronze' : 'text-gray-500'
                }`}>
                  {item.rank}
                </div>
                <div className="flex-1 ml-3">
                  <div className="font-medium">{item.name}</div>
                  <div className="text-xs text-gray-400">{item.anime}</div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="font-bold neon-text-green">{item.score}</div>
                  <div className="text-xs">
                    {item.change === 'up' && <span className="text-green-400">↑</span>}
                    {item.change === 'down' && <span className="text-red-400">↓</span>}
                    {item.change === 'same' && <span className="text-gray-400">-</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <button className="w-full mt-4 border border-neon-green border-opacity-50 rounded-md py-2 text-sm text-neon-green hover:bg-neon-green hover:bg-opacity-10 transition-all">
            查看完整排名
          </button>
        </motion.div>
        
        {/* 数据概览卡片 */}
        <motion.div 
          className="card bg-dark-elevated md:col-span-2"
          variants={itemVariants}
        >
          <h2 className="text-xl font-semibold mb-4 neon-text-yellow">数据概览</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { title: '监测动漫作品', value: '128部', icon: '🎬', color: 'neon-pink' },
              { title: '收录巡礼地点', value: '1,247处', icon: '📍', color: 'neon-blue' },
              { title: '社交媒体数据', value: '238万条', icon: '💬', color: 'neon-green' },
              { title: '用户巡礼记录', value: '42,891次', icon: '👣', color: 'neon-yellow' },
              { title: '平均满意度', value: '92.6%', icon: '⭐', color: 'neon-pink' },
              { title: '转化旅游收入', value: '9.7亿日元', icon: '💴', color: 'neon-blue' },
              { title: '新增打卡地点', value: '+78处/月', icon: '📈', color: 'neon-green' },
              { title: '数据更新频率', value: '实时', icon: '🔄', color: 'neon-yellow' }
            ].map((item, index) => (
              <div 
                key={index} 
                className="flex flex-col items-center justify-center bg-dark-base rounded-lg p-3 hover:scale-105 transition-all"
              >
                <div className={`text-4xl mb-1 ${item.color}`}>{item.icon}</div>
                <div className={`text-xl font-bold ${item.color}`}>{item.value}</div>
                <div className="text-xs text-gray-400 text-center">{item.title}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
      
      {/* 情感分析热力图 */}
      <motion.div
        className="card bg-dark-elevated mb-6"
        variants={itemVariants}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold neon-text-blue">社交媒体情感分析</h2>
          <div className="flex space-x-2">
            <select className="bg-dark-base text-xs px-2 py-1 rounded border border-gray-700">
              <option>全部平台</option>
              <option>微博</option>
              <option>小红书</option>
              <option>B站</option>
            </select>
            <button className="bg-dark-base px-2 py-1 rounded text-xs">
              详情
            </button>
          </div>
        </div>
        
        <div 
          ref={sentimentRef}
          className="w-full h-[400px] relative"
        >
          {!sentimentChartReady && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-pulse flex flex-col items-center">
                <div className="rounded-full h-12 w-12 bg-neon-blue mb-2 opacity-50"></div>
                <div className="text-neon-blue">加载情感数据...</div>
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-3 text-xs text-gray-500">
          * 基于NLP对社交媒体内容进行情感分析，展示不同时段用户情感分布
        </div>
      </motion.div>
      
      {/* 底部操作区 */}
      <motion.div 
        className="flex flex-col md:flex-row justify-between items-center gap-4 pt-4 border-t border-gray-800"
        variants={itemVariants}
      >
        <div className="text-gray-400 text-sm">
          <p>数据集: <span className="text-neon-blue">2023年全年数据</span> | 更新时间: <span className="text-neon-green">今天 08:32</span></p>
          <p className="text-xs mt-1">本分析引擎基于Spark大数据处理框架，分析超过238万条社交媒体数据</p>
        </div>
        
        <div className="flex space-x-3">
          <button onClick={exportReport} className="px-4 py-2 bg-gradient-to-r from-neon-pink to-neon-purple rounded-md text-white shadow-glow-pink">
            导出分析报告
          </button>
          <button className="px-4 py-2 bg-dark-base border border-gray-700 rounded-md text-gray-300 hover:text-white transition-colors">
            自定义分析
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default SparkAnalysis; 