import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

export type PayloadVerify = {
  username: string;
  sub: number;
  isAdmin: boolean;
};

export type UserAfterVerify = {
  userId: number;
  username: string;
  isAdmin: boolean;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jjj') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.ACCESS_TOKEN_SECRET,
    });
  }

  async validate(payload: PayloadVerify): Promise<UserAfterVerify> {
    console.log('validate in strategy');
    console.log('payload: ', payload); // it is data after decode jwt token.
    return {
      userId: payload.sub,
      username: payload.username,
      isAdmin: payload.isAdmin,
    };
  }
}
