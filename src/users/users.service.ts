import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersModel } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersModel)
    private readonly userRepository: Repository<UsersModel>,
  ) {}

  // 이메일로 가입한 유저 정보
  async getUserByEmail(email: string) {
    return this.userRepository.findOne({
      where: {
        email,
      },
    });
  }

  async createUser(
    userInfo: Pick<UsersModel, 'email' | 'password' | 'nickname'>,
  ) {
    const emailExists = await this.userRepository.exists({
      where: {
        email: userInfo.email,
      },
    });
    if (emailExists) {
      throw new BadRequestException('이미 가입한 이메일 입니다.');
    }

    const userObject = this.userRepository.create({
      nickname: userInfo.nickname,
      email: userInfo.email,
      password: userInfo.password,
    });
    const newUser = this.userRepository.save(userObject);
    return newUser;
  }
}
