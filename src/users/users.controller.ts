import { Controller, Get, UseGuards } from '@nestjs/common';
import { User } from 'common/decorators/user.decorator';
import { JwtAuthGuard } from 'common/guards/jwt-auth.guard';
import { UserEntity } from './entities/user.entity';

@Controller('users')
export class UsersController {
  /**
   * Passport will be verifies the token to JSON payload and passes it to the validate method
   * as parameter.
   * The returns of validate method will be attched to Request object as user property.
   */
  @UseGuards(JwtAuthGuard)
  @Get()
  whoAmI(@User() user: Partial<UserEntity>) {
    return user;
  }
}
