import { ApiProperty } from '@nestjs/swagger';
export class AuthDto {
  @ApiProperty({ example: 'thoanh<3' })
  username: string;

  @ApiProperty({ example: 'thoxinh' })
  password: string;

  // @ApiProperty({ required: false, example: false })
  isAdmin?: boolean;
}
