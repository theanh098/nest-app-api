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
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentEntity } from './entities/comment.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRespository: Repository<CommentEntity>,
    private readonly postService: PostsService,
  ) {}

  async create(createCommentDto: CreateCommentDto, userId: number) {
    const { content, postId } = createCommentDto;

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
    const newComment = plainToClass(CommentEntity, {
      content,
      post,
      user: author,
    });


    await this.commentRespository.save(newComment);
  }
  async findAll(postId: number) {
    const qb = this.commentRespository
      .createQueryBuilder('comment')
      .leftJoin('comment.post', 'post')
      .leftJoin('comment.user', 'user')
      .where('post.id = :id', { id: postId })
      .select('comment.*')
      .addSelect('user.username', 'author');

    const comments = await qb.getRawMany();
    return comments;
  }
  // findOne(id: number) {
  //   return `This action returns a #${id} comment`;
  // }
  async update(id: number, content: string, userId: number) {
    const qb = this.commentRespository
      .createQueryBuilder('comment')
      .leftJoin('comment.user', 'user')
      .where('comment.id = :id', { id })
      .select('user.id', 'author');

    const comment = await qb.getRawOne();

    if (userId !== comment.author) throw new UnauthorizedException();

    await this.commentRespository
      .createQueryBuilder()
      .update(CommentEntity)
      .set({
        content,
      })
      .where('id = :id', { id })
      .execute();
  }
  async remove(id: number, userId: number) {
    const qb = this.commentRespository
      .createQueryBuilder('comment')
      .leftJoin('comment.user', 'user')
      .where('comment.id = :id', { id })
      .select('user.id', 'author');

    const comment = await qb.getRawOne();

    if (userId !== comment.author) throw new UnauthorizedException();

    await this.commentRespository
      .createQueryBuilder()
      .delete()
      .from(CommentEntity)
      .where('id = :id', { id })
      .execute();
  }
}
