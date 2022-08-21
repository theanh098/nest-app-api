import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsPositive, Max } from 'class-validator';

export class PaginationQuery {
  @ApiPropertyOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @IsPositive()
  @IsOptional()
  pageNumber?: number = 1;

  @ApiPropertyOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Max(100)
  @IsPositive()
  @IsOptional()
  pageSize?: number = 20;
}
