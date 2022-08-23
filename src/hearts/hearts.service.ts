import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { PostsService } from 'posts/posts.service';
import { Repository } from 'typeorm';
import { HeartEntity } from './entities/heart.entity';
// import { CreateHeartDto } from './dto/create-heart.dto';
// import { UpdateHeartDto } from './dto/update-heart.dto';

@Injectable()
export class HeartsService {
  constructor(
    @InjectRepository(HeartEntity)
    private readonly heartRespositoty: Repository<HeartEntity>,
    private readonly postService: PostsService,
  ) {}

  async create(postId: number, userId: number) {
    const postQb = this.postService.postRepository
      .createQueryBuilder('post')
      .where('post.id = :id', { id: postId });

    const userQb = this.postService.userRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id: userId });

    const [post, author] = await Promise.all([
      postQb.getOne(),
      userQb.getOne(),
    ]);

    if (!postQb || !author)
      throw new HttpException('somthing was wrong', HttpStatus.BAD_REQUEST);

    await this.heartRespositoty.save(
      plainToClass(HeartEntity, { user: author, post }),
    );
  }

  async remove(id: number, userId: number) {
    const { author } = await this.heartRespositoty
      .createQueryBuilder('heart')
      .leftJoin('heart.user', 'user')
      .where('heart.id = :id', { id })
      .select('user.id', 'author')
      .getRawOne();
    if (author !== userId) throw new UnauthorizedException();
    await this.heartRespositoty
      .createQueryBuilder()
      .delete()
      .from(HeartEntity)
      .where('id = :id', { id })
      .execute();
  }
}
