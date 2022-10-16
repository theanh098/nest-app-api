import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Body, Injectable, Req, UnauthorizedException } from '@nestjs/common';
import { AuthService } from 'auth/auth.service';
import { UserEntity } from 'users/entities/user.entity';
import { Request } from 'express';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      passReqToCallback: true,
    });
  }

  async validate(
    @Req() req: Request,
    username: string,
    password: string,
  ): Promise<Partial<UserEntity>> {
    console.log('req in valiate local strategy: ', req.body);
    console.log('address: ', req.body.address);
    console.log('username: ', username);
    console.log('password: ', password);

    const user = await this.authService.validateUSer(username, password);
    console.log('user in strategy: ', user);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
