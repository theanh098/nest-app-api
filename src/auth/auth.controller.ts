import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthGuardLocal } from 'common/guards/local-auth.guard';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Request as ReqExpress } from 'express';

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
  async signIn(@Request() req: ReqExpress) {
    return this.authService.login(req);
  }

  @Post('refresh-token')
  async refreshToken(@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }
}
