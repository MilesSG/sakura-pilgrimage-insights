import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import * as echarts from 'echarts';
import { EChartsOption } from 'echarts';

// 定义分析任务类型
interface AnalysisTask {
  id: string;
  name: string;
  description: string;
  status: 'idle' | 'running' | 'completed' | 'error';
  progress: number;
  duration?: number;
  result?: any;
}

// 定义影响因素类型
interface InfluenceFactor {
  name: string;
  value: number;
  description: string;
  trend: 'up' | 'down' | 'stable';
  keywords: string[];
}

// 模拟的影响因素数据
const mockFactors: InfluenceFactor[] = [
  {
    name: '原作人气',
    value: 0.92,
    description: '原作动漫/漫画的人气程度对圣地巡礼热度有直接影响',
    trend: 'up',
    keywords: ['新作品', '续作', '经典', '销量', '口碑']
  },
  {
    name: '场景还原度',
    value: 0.85,
    description: '动漫场景与现实地点的相似程度',
    trend: 'stable',
    keywords: ['相似', '一致', '还原', '参考', '取景']
  },
  {
    name: '交通便利性',
    value: 0.72,
    description: '前往圣地的交通便利程度',
    trend: 'up',
    keywords: ['车站', '公交', '机场', '交通', '路线']
  },
  {
    name: '社交媒体曝光',
    value: 0.89,
    description: '在社交媒体上的讨论热度和曝光率',
    trend: 'up',
    keywords: ['分享', '讨论', '热搜', '话题', '推荐']
  },
  {
    name: '周边旅游资源',
    value: 0.65,
    description: '圣地周边的其他旅游景点和资源',
    trend: 'stable',
    keywords: ['景点', '酒店', '美食', '购物', '文化']
  },
  {
    name: '官方推广力度',
    value: 0.78,
    description: '当地政府或企业对动漫圣地的推广力度',
    trend: 'up',
    keywords: ['活动', '宣传', '合作', '周边', '节日']
  },
  {
    name: '粉丝社区活跃度',
    value: 0.83,
    description: '动漫粉丝社区的活跃程度和组织能力',
    trend: 'up',
    keywords: ['社区', '讨论', '组织', '活动', '应援']
  },
  {
    name: '季节性因素',
    value: 0.58,
    description: '季节变化对访问热度的影响',
    trend: 'down',
    keywords: ['季节', '假期', '节日', '天气', '樱花']
  }
];

// 预设分析任务
const predefinedTasks: AnalysisTask[] = [
  {
    id: 'factor-analysis',
    name: '影响因素分析',
    description: '分析影响动漫圣地巡礼热度的关键因素及其权重',
    status: 'idle',
    progress: 0
  },
  {
    id: 'sentiment-correlation',
    name: '情感相关性分析',
    description: '分析社交媒体上的情感表达与圣地访问热度的相关性',
    status: 'idle',
    progress: 0
  },
  {
    id: 'time-series',
    name: '时间序列预测',
    description: '基于历史数据预测未来6个月的圣地访问热度趋势',
    status: 'idle',
    progress: 0
  },
  {
    id: 'location-clustering',
    name: '地理位置聚类',
    description: '对圣地位置进行聚类分析，发现地理分布规律',
    status: 'idle',
    progress: 0
  }
];

function SparkAnalysis() {
  const [tasks, setTasks] = useState<AnalysisTask[]>(predefinedTasks);
  const [activeTask, setActiveTask] = useState<string | null>(null);
  const [factorResults, setFactorResults] = useState<InfluenceFactor[]>([]);
  const [showCode, setShowCode] = useState(false);
  
  const factorChartRef = useRef<HTMLDivElement>(null);
  
  // 运行分析任务
  const runAnalysis = (taskId: string) => {
    // 如果有正在运行的任务，则不允许开始新任务
    if (tasks.some(t => t.status === 'running')) return;
    
    // 更新任务状态为运行中
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? { ...task, status: 'running' as const, progress: 0 } 
          : task
      )
    );
    
    setActiveTask(taskId);
    
    // 模拟分析过程
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 5) + 1;
      
      if (progress >= 100) {
        clearInterval(interval);
        
        // 根据任务ID设置不同的结果
        if (taskId === 'factor-analysis') {
          setFactorResults(mockFactors);
        }
        
        // 更新任务状态为完成
        setTasks(prevTasks => 
          prevTasks.map(task => 
            task.id === taskId 
              ? { 
                  ...task, 
                  status: 'completed' as const, 
                  progress: 100,
                  duration: Math.floor(Math.random() * 120) + 60 // 60-180s
                } 
              : task
          )
        );
      } else {
        // 更新进度
        setTasks(prevTasks => 
          prevTasks.map(task => 
            task.id === taskId 
              ? { ...task, progress } 
              : task
          )
        );
      }
    }, 200);
  };
  
  // 重置任务状态
  const resetAnalysis = (taskId: string) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? { ...task, status: 'idle' as const, progress: 0, duration: undefined } 
          : task
      )
    );
    
    if (activeTask === taskId) {
      setFactorResults([]);
      setActiveTask(null);
    }
  };
  
  // 初始化图表
  useEffect(() => {
    if (!factorChartRef.current || factorResults.length === 0) return;
    
    const chart = echarts.init(factorChartRef.current);
    
    const option: EChartsOption = {
      backgroundColor: 'transparent',
      title: {
        text: '影响因素权重分析',
        textStyle: {
          color: '#fff',
          fontWeight: 'normal'
        },
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: (params: any) => {
          const data = params[0];
          const factor = factorResults.find(f => f.name === data.name);
          if (!factor) return '';
          
          return `
            <div>
              <div style="font-weight: bold; margin-bottom: 5px;">${factor.name}: ${(factor.value * 100).toFixed(0)}%</div>
              <div style="margin-bottom: 5px;">${factor.description}</div>
              <div>趋势: ${factor.trend === 'up' ? '↑ 上升' : factor.trend === 'down' ? '↓ 下降' : '→ 稳定'}</div>
              <div>关键词: ${factor.keywords.join(', ')}</div>
            </div>
          `;
        }
      },
      grid: {
        left: '3%',
        right: '12%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        axisLabel: {
          formatter: '{value}%',
          color: '#ccc'
        },
        max: 100,
        splitLine: {
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.1)'
          }
        },
        axisLine: {
          lineStyle: {
            color: '#444'
          }
        }
      },
      yAxis: {
        type: 'category',
        data: factorResults.map(factor => factor.name),
        axisLabel: {
          color: '#ccc'
        },
        axisLine: {
          lineStyle: {
            color: '#444'
          }
        }
      },
      series: [
        {
          name: '影响权重',
          type: 'bar',
          data: factorResults.map(factor => ({
            value: (factor.value * 100).toFixed(0),
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: '#9D00FF' },
                { offset: 1, color: factor.trend === 'up' ? '#39FF14' : factor.trend === 'down' ? '#FF00FF' : '#00FFFF' }
              ])
            }
          })),
          label: {
            show: true,
            position: 'right',
            color: '#fff',
            formatter: '{c}%'
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
  }, [factorResults]);

  return (
    <div className="p-4">
      <header className="container mx-auto py-4">
        <h1 className="text-3xl font-bold neon-text-purple">Spark分析引擎</h1>
        <p className="mt-2 text-gray-400">
          基于大数据分析技术，深入挖掘动漫圣地巡礼的影响因素
        </p>
      </header>

      <main className="container mx-auto mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左侧任务列表 */}
          <div className="lg:col-span-1">
            <div className="card bg-dark-elevated">
              <h2 className="text-xl font-semibold mb-4">分析任务</h2>
              
              <div className="space-y-4">
                {tasks.map(task => (
                  <div key={task.id} className="bg-dark-surface p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{task.name}</h3>
                      <span 
                        className={`text-xs px-2 py-1 rounded-full ${
                          task.status === 'completed' ? 'bg-green-900 text-green-300' :
                          task.status === 'running' ? 'bg-blue-900 text-blue-300' :
                          task.status === 'error' ? 'bg-red-900 text-red-300' :
                          'bg-gray-700 text-gray-300'
                        }`}
                      >
                        {
                          task.status === 'completed' ? '已完成' :
                          task.status === 'running' ? '运行中' :
                          task.status === 'error' ? '错误' : '待处理'
                        }
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-400 mb-3">{task.description}</p>
                    
                    {task.status === 'running' && (
                      <div className="w-full bg-dark-base rounded-full h-2 mb-3">
                        <div 
                          className="h-2 rounded-full bg-gradient-to-r from-neon-purple to-neon-blue"
                          style={{ width: `${task.progress}%` }}
                        />
                      </div>
                    )}
                    
                    {task.status === 'completed' && task.duration && (
                      <p className="text-xs text-gray-500 mb-3">
                        处理时间: {task.duration} 秒
                      </p>
                    )}
                    
                    <div className="flex space-x-2">
                      {task.status !== 'running' && (
                        <button
                          className={`flex-1 py-1.5 px-3 rounded-md text-sm ${
                            task.status === 'completed' 
                              ? 'bg-dark-base text-gray-300 hover:bg-dark-elevated' 
                              : 'bg-neon-purple bg-opacity-20 neon-text-purple hover:bg-opacity-30'
                          }`}
                          onClick={() => runAnalysis(task.id)}
                        >
                          {task.status === 'completed' ? '查看结果' : '运行分析'}
                        </button>
                      )}
                      
                      {task.status === 'completed' && (
                        <button
                          className="py-1.5 px-3 rounded-md text-sm bg-dark-base text-gray-300 hover:bg-dark-elevated"
                          onClick={() => resetAnalysis(task.id)}
                        >
                          重置
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* 右侧结果展示 */}
          <div className="lg:col-span-2">
            {/* 代码模拟器切换按钮 */}
            <div className="flex justify-end mb-4">
              <button
                className={`px-3 py-1.5 rounded-md text-sm flex items-center ${
                  showCode 
                    ? 'bg-neon-green bg-opacity-20 neon-text-green' 
                    : 'bg-dark-elevated text-gray-300'
                }`}
                onClick={() => setShowCode(!showCode)}
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                {showCode ? '隐藏代码' : '显示代码'}
              </button>
            </div>
            
            {/* 代码模拟器 */}
            {showCode && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="card bg-dark-elevated mb-4"
              >
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <span className="text-neon-green mr-2">Spark</span> 分析代码
                </h2>
                <div className="bg-[#1a1a1a] rounded-md p-4 font-mono text-sm overflow-x-auto">
                  <pre className="text-gray-300">
{`// 影响因素分析Spark代码
import org.apache.spark.sql.{SparkSession, DataFrame}
import org.apache.spark.ml.feature.{CountVectorizer, IDF}
import org.apache.spark.ml.clustering.LDA

// 初始化Spark Session
val spark = SparkSession.builder()
  .appName("AnimePilgrimageAnalysis")
  .config("spark.memory.offHeap.enabled", true)
  .config("spark.memory.offHeap.size", "2g")
  .getOrCreate()

// 加载数据
val rawData = spark.read.json("s3://anime-pilgrimage/social-data/*.json")

// 数据预处理
val processedData = rawData
  .filter($"relevance" > 0.6)  // 过滤出相关度高的数据
  .withColumn("date", to_date($"timestamp"))
  .withColumn("year_month", date_format($"date", "yyyy-MM"))
  .cache()

// 情感分析聚合
val sentimentByAnime = processedData
  .groupBy("anime_title")
  .agg(
    avg("sentiment_score").as("avg_sentiment"),
    count("*").as("mention_count")
  )
  .orderBy(desc("mention_count"))

// 关键词提取与主题建模
val textFeatures = new CountVectorizer()
  .setInputCol("processed_text")
  .setOutputCol("raw_features")
  .fit(processedData)
  .transform(processedData)

val idf = new IDF()
  .setInputCol("raw_features")
  .setOutputCol("features")
  .fit(textFeatures)
  .transform(textFeatures)

// 建立影响因素LDA模型
val lda = new LDA()
  .setK(8)  // 8个主题/因素
  .setMaxIter(10)
  .setFeaturesCol("features")

val ldaModel = lda.fit(idf)
val topics = ldaModel.describeTopics(10)  // 每个主题的前10个词

// 计算影响因素权重
val factorWeights = calculateFactorWeights(processedData, topics)

// 输出结果到JSON
factorWeights.write
  .mode("overwrite")
  .json("s3://anime-pilgrimage/analysis-results/factor-weights")`}
                  </pre>
                </div>
              </motion.div>
            )}
            
            {activeTask ? (
              factorResults.length > 0 ? (
                <div className="card bg-dark-elevated">
                  <div ref={factorChartRef} className="w-full h-[600px]" />
                </div>
              ) : (
                <div className="card bg-dark-elevated flex flex-col items-center justify-center h-[400px]">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-12 h-12 border-4 border-neon-purple rounded-full border-t-transparent mb-4"
                  />
                  <p className="text-lg neon-text-purple">正在分析数据，请稍候...</p>
                  <p className="text-sm text-gray-400 mt-2">
                    {tasks.find(t => t.id === activeTask)?.name} - {
                      tasks.find(t => t.id === activeTask)?.progress
                    }%
                  </p>
                </div>
              )
            ) : (
              <div className="card bg-dark-elevated flex flex-col items-center justify-center h-[400px] text-gray-400">
                <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <p className="text-lg">请选择左侧任务开始分析</p>
                <p className="text-sm mt-2">
                  基于Spark的大数据分析引擎将深入挖掘动漫圣地巡礼的关键影响因素
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default SparkAnalysis; 