import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
export class CreatePostDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  imgURL: string;
}
