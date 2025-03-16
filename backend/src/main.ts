import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // 启用CORS
  app.use(cors());
  
  // 设置全局路由前缀
  app.setGlobalPrefix('api');
  
  // 启动服务器
  await app.listen(3000);
  console.log(`应用已启动: http://localhost:3000/`);
}

bootstrap(); 