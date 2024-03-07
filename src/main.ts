import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // NestFactory 호출 전에는 ConfigModuel 활성화 되지 않음.
  const configService = app.get(ConfigService);
  await app.listen(3000);

  console.log(`This server is running on ${configService.get('SERVICE_URL')}`);
}
bootstrap();
