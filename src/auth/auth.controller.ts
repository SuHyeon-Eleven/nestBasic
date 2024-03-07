import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(
    @Body('email') email: string,
    @Body('nickname') nickname: string,
    @Body('password') password: string,
  ) {
    return this.authService.signupWithEmail({ email, nickname, password });
  }
}
