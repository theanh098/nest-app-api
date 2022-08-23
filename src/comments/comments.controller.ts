import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserAfterVerify } from 'auth/strategies/jwt.strategy';
import { User } from 'common/decorators/user.decorator';
import { JwtAuthGuard } from 'common/guards/jwt-auth.guard';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
@ApiTags('Comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() createCommentDto: CreateCommentDto,
    @User() { userId }: UserAfterVerify,
  ) {
    return this.commentsService.create(createCommentDto, userId);
  }

  @Get()
  findAll(@Query('postId') postId: number) {
    return this.commentsService.findAll(postId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() { content }: UpdateCommentDto,
    @User() { userId }: UserAfterVerify,
  ) {
    return this.commentsService.update(id, content, userId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: number, @User() { userId }: UserAfterVerify) {
    return this.commentsService.remove(id, userId);
  }
}
