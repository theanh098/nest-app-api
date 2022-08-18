import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

export type PayloadVerify = {
  username: string;
  sub: number;
  isAdmin: boolean;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy,'jjj') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'mysecret',
    });
  }

  async validate(payload: PayloadVerify) {

    console.log('payload in validate straregy: ', payload)

    return {
      userId: payload.sub,
      username: payload.username,
      isAdmin: payload.isAdmin,
    };
  }
}
