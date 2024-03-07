import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersModel } from 'src/users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  // 토큰 발급
  signToken(user: Pick<UsersModel, 'email' | 'id'>, isRefrdshToken: boolean) {
    const payload = {
      email: user.email,
      sub: user.id,
      type: isRefrdshToken ? 'refresh' : 'access',
    };

    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: isRefrdshToken ? 3600 : 300,
    });
  }
  //로그인
  async loginWithEmail(userInfo: Pick<UsersModel, 'email' | 'password'>) {
    const existsUser = await this.userService.getUserByEmail(userInfo.email);
    if (!existsUser) {
      throw new UnauthorizedException('해당 이메일 계정은 존재하지 않습니다.');
    }
    const comparedPassword = await bcrypt.compare(
      userInfo.password,
      existsUser.password,
    );

    if (!comparedPassword) {
      throw new UnauthorizedException('로그인 정보가 올바르지 않습니다.');
    }

    const tokenInfo = { email: existsUser.email, id: existsUser.id };

    // 계정 존재,비밀번호 확인 후 토큰발급
    const accessToken = this.signToken(tokenInfo, false);
    const refreshToken = this.signToken(tokenInfo, true);

    return { accessToken: accessToken, refreshToken: refreshToken };
  }

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
  // 토큰만 추출
  extractsToken(rawToken: string) {
    const splitToken = rawToken.split(' ');
    if (splitToken.length !== 2) {
      throw new UnauthorizedException('유효하지 않은 토큰 입니다.');
    }
    return splitToken[1];
  }
}
