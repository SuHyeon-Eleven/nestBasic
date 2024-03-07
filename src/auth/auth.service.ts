import { Injectable } from '@nestjs/common';
import { UsersModel } from 'src/users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { userInfo } from 'os';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService) {}
  /**
   * 1.회원가입
   * 2.로그인
   * 3.토큰발급
   */

  // 회원가입
  async signupWithEmail(
    signupInfo: Pick<UsersModel, 'email' | 'password' | 'nickname'>,
  ) {
    const hashedPassword = await bcrypt.hash(signupInfo.password, 10);

    const newUser = await this.userService.createUser({
      ...signupInfo,
      password: hashedPassword,
    });

    return { email: newUser.email, nickname: newUser.nickname };
  }
}
