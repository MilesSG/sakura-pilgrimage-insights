/**
 * API测试脚本
 * 
 * 这个脚本可以测试后端API的基本功能，确保所有接口正常工作
 * 使用方法：
 * 1. 确保后端服务已经启动
 * 2. 运行 ts-node src/test-api.ts
 */

import * as http from 'http';

const API_BASE = 'http://localhost:3000/api';

// 简单的HTTP GET请求函数
async function httpGet(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// 测试所有API端点
async function testAllEndpoints() {
  console.log('开始测试API端点...');
  console.log('-------------------');
  
  try {
    // 测试圣地巡礼API
    console.log('测试圣地巡礼API:');
    const spots = await httpGet(`${API_BASE}/pilgrimage/spots`);
    console.log(`- 获取所有圣地: ${spots.length} 个圣地点`);
    
    const popularSpots = await httpGet(`${API_BASE}/pilgrimage/popular`);
    console.log(`- 获取热门圣地: ${popularSpots.length} 个圣地点`);
    
    const stats = await httpGet(`${API_BASE}/pilgrimage/stats`);
    console.log(`- 获取圣地统计数据: ${stats.totalSpots} 个圣地点，${stats.totalAnime} 个动漫作品`);
    
    console.log('圣地巡礼API测试成功！');
    console.log('-------------------');
    
    // 测试爬虫API
    console.log('测试爬虫API:');
    const platforms = await httpGet(`${API_BASE}/crawler/platforms`);
    console.log(`- 获取支持的平台: ${platforms.length} 个平台`);
    
    const crawlerData = await httpGet(`${API_BASE}/crawler/data?limit=3`);
    console.log(`- 获取爬取数据: ${crawlerData.length} 条数据`);
    
    const crawlerStats = await httpGet(`${API_BASE}/crawler/stats`);
    console.log(`- 获取爬虫统计: 总计 ${crawlerStats.totalDataCollected} 条数据`);
    
    console.log('爬虫API测试成功！');
    console.log('-------------------');
    
    // 测试分析API
    console.log('测试分析API:');
    const factors = await httpGet(`${API_BASE}/analysis/factors`);
    console.log(`- 获取影响因素: ${factors.length} 个因素`);
    
    const trends = await httpGet(`${API_BASE}/analysis/trends`);
    console.log(`- 获取趋势数据: ${trends.series.length} 个系列, ${trends.dates.length} 个时间点`);
    
    const tasks = await httpGet(`${API_BASE}/analysis/tasks`);
    console.log(`- 获取可用分析任务: ${tasks.length} 个任务`);
    
    const sentiment = await httpGet(`${API_BASE}/analysis/sentiment`);
    console.log(`- 获取情感分析数据: ${sentiment.data.length} 种情感类型`);
    
    console.log('分析API测试成功！');
    console.log('-------------------');
    
    console.log('所有API测试成功完成！');
  } catch (error) {
    console.error('测试失败:', error);
  }
}

// 执行测试
testAllEndpoints(); 