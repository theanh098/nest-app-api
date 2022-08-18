import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from 'users/entities/user.entity';
import { plainToClass } from 'class-transformer';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import type { PayloadVerify } from './jwt.strategy';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {}

  async validateUSer(username: string, pass: string) {
    const user = await this.userRepository.findOne({
      where: {
        username,
      },
    });

    if (!user) return null;

    const { password, ...rest } = user;
    const isValid = await bcrypt.compare(pass, password);
    return isValid ? rest : null;
  }

  async login(req: Request) {
    const user = req.user as Partial<UserEntity>;
    const payload: PayloadVerify = {
      sub: user.id,
      username: user.username,
      isAdmin: user.isAdmin,
    };

    const response = {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign({ sub: user.id }),
      user,
    };

    return response;
  }

  async register(user: AuthDto) {
    const newUser = plainToClass(UserEntity, user);
    await this.userRepository.save(newUser);
  }

  async refreshToken(refreshToken: string) {
    return 'refresh token'
  }

}
