import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthGuardLocal } from 'common/guards/local-auth.guard';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { JwtRefreshAuthGuard } from 'common/guards/jwt-refresh.guard';
import { User } from 'common/decorators/user.decorator';
import { UserEntity } from 'users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async create(@Body() createAuthDto: AuthDto) {
    console.log('body: ', createAuthDto);
    return this.authService.register(createAuthDto);
  }

  /**
   * The returns of valiadate method in local strategy will be attached to Request object
   * as user property. Or maybe validate method throw exception
   */
  @UseGuards(AuthGuardLocal)
  @Post('login')
  async signIn(@User() user: Partial<UserEntity>) {
    return this.authService.login(user);
  }

  @UseGuards(JwtRefreshAuthGuard)
  @Post('refresh-token')
  async refreshToken(
    @Body('refreshToken') refreshToken: string,
    @User() { userId }: { userId: number },
  ) {
    return this.authService.refreshToken(refreshToken, userId);
  }
}
