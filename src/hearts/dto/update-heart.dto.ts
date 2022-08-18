import { PartialType } from '@nestjs/mapped-types';
import { CreateHeartDto } from './create-heart.dto';

export class UpdateHeartDto extends PartialType(CreateHeartDto) {}
