import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from 'users/entities/user.entity';
import { plainToClass } from 'class-transformer';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import type { PayloadVerify } from './strategies/jwt.strategy';
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

  async login(user: Partial<UserEntity>) {
    const payload: PayloadVerify = {
      sub: user.id,
      username: user.username,
      isAdmin: user.isAdmin,
    };
    const tokens = await this.generateToken(payload);
    delete user.refreshToken;
    const response = {
      ...tokens,
      user,
    };

    return response;
  }

  async register(user: AuthDto) {
    const newUser = plainToClass(UserEntity, user);
    const isExist = await this.userRepository
      .createQueryBuilder('user')
      .where('user.username = :username', { username: user.username })
      .getOne();
    if (isExist)
      throw new HttpException('username is existed', HttpStatus.BAD_REQUEST);
    await this.userRepository.save(newUser);
  }

  async refreshToken(refreshToken: string, userId: number) {
    console.log('refresh token: ', refreshToken);

    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id: userId })
      .getOne();
    if (refreshToken !== user.refreshToken) throw new UnauthorizedException();

    const payload: PayloadVerify = {
      sub: user.id,
      username: user.username,
      isAdmin: user.isAdmin,
    };

    const newTokens = await this.generateToken(payload);
    delete user.password;
    delete user.refreshToken;
    return {
      ...newTokens,
      ...user,
    };
  }

  async generateToken(payload: PayloadVerify) {
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
      secret: process.env.ACCESS_TOKEN_SECRET,
    });

    const refreshToken = this.jwtService.sign(
      { sub: payload.sub },
      {
        expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
        secret: process.env.REFRESH_TOKEN_SECRET,
      },
    );

    await this.userRepository.update(payload.sub, {
      refreshToken,
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
