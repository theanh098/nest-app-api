import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserAfterVerify } from 'auth/strategies/jwt.strategy';
import { User } from 'common/decorators/user.decorator';
import { JwtAuthGuard } from 'common/guards/jwt-auth.guard';
import { CreateHearDto } from './dto/create-heart.dto';
import { HeartsService } from './hearts.service';

@ApiTags('Hearts')
@Controller('hearts')
export class HeartsController {
  constructor(private readonly heartsService: HeartsService) {}
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() { postId }: CreateHearDto,
    @User() { userId }: UserAfterVerify,
  ) {
    return this.heartsService.create(postId, userId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: number, @User() { userId }: UserAfterVerify) {
    return this.heartsService.remove(id, userId);
  }
}
