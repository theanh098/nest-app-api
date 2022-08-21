import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserAfterVerify } from 'auth/strategies/jwt.strategy';
import { User } from 'common/decorators/user.decorator';
import { JwtAuthGuard } from 'common/guards/jwt-auth.guard';
import { PaginationQuery } from 'common/pagination/pagination.query';
import { CreatePostDto } from './dto/create-post.dto';
import { PostsService } from './posts.service';
// import { UpdatePostDto } from './dto/update-post.dto';
@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() newPost: CreatePostDto, @User() { userId }: UserAfterVerify) {
    return this.postsService.create(newPost, userId);
  }

  @Get()
  findAll(@Query() pagination: PaginationQuery) {
    return this.postsService.findAll(pagination);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.postsService.findOne(id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
  //   return this.postsService.update(+id, updatePostDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.postsService.remove(id);
  }
}
