import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModel } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UsersModel])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // exports 설정시 다른모듈에서도 사용 가능하게 함.
})
export class UsersModule {}
