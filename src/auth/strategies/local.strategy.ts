import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from 'auth/auth.service';
import { UserEntity } from 'users/entities/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(
    username: string,
    password: string,
  ): Promise<Partial<UserEntity>> {
    console.log('username: ', username);
    console.log('password: ', password);
    const user = await this.authService.validateUSer(username, password);
    if (!user) {
      console.log('cmmmmm');
      throw new UnauthorizedException();
    }
    return user;
  }
}
