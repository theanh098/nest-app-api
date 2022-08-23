import { ApiProperty } from '@nestjs/swagger';

export class CreateHearDto {
  @ApiProperty()
  postId: number;
}
