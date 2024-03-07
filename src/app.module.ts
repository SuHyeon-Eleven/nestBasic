import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import config from './configs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // env 파일 path
      envFilePath: `${process.cwd()}/envs/${process.env.NODE_ENV}.env`,
      // 커스텀 파일 ex).ts .yaml등
      load: [config],
      cache: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
