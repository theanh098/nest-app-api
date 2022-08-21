import { ApiProperty } from '@nestjs/swagger';

export class RefreshToken {
  @ApiProperty()
  refreshToken: string;
}
