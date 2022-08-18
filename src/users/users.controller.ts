import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'common/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  /**
   * Passport will be verifies the token to JSON payload and passes it to the validate method
   * as parameter.
   * The returns of validate method will be attched to Request object as user property.
   */
  @UseGuards(JwtAuthGuard)
  @Get()
  whoAmI(@Req() req: any) {
    return 'I am Badao !';
  }
}
