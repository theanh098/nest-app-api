import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { PaginationQuery } from 'common/pagination/pagination.query';
import { Repository } from 'typeorm';
import { UserEntity } from 'users/entities/user.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostEntity } from './entities/post.entity';
// import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostEntity)
    readonly postRepository: Repository<PostEntity>,
    @InjectRepository(UserEntity)
    readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(newPost: CreatePostDto, userId: number) {
    const author = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id: userId })
      .getOne();
    const post = plainToClass(PostEntity, { ...newPost, user: author });
    await this.postRepository.save(post);
  }

  async update(id: number, newPost: UpdatePostDto, useId: number) {
    const postToUpdate = await this.postRepository
      .createQueryBuilder('post')
      .leftJoin('post.user', 'user')
      .where('post.id = :id', { id })
      .select('user.id', 'author')
      .getRawOne();

    if (postToUpdate.author !== useId) throw new UnauthorizedException();
    const post = await this.postRepository
      .createQueryBuilder()
      .update(PostEntity)
      .set({
        ...newPost,
      })
      .where('id = :id', { id })
      .execute();

    const { affected } = post;
    if (!affected) throw new HttpException('not found', HttpStatus.NOT_FOUND);
  }

  async findAll(pagination?: PaginationQuery) {
    const { pageNumber, pageSize } = pagination;
    const qb = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.comments', 'cmts');

    if (pageNumber && pageSize)
      qb.limit(pageSize).offset((pageNumber - 1) * pageSize);
    const result = await qb.getMany();
    return result;
  }

  async findOne(id: number) {
    const post = await this.postRepository
      .createQueryBuilder('post')
      .where('post.id = :id', { id })
      .getOne();
    if (!post) throw new HttpException('not found', HttpStatus.NOT_FOUND);
    return post;
  }

  async remove(id: number, isAdmin: boolean, userId: number) {
    const qb = this.postRepository
      .createQueryBuilder()
      .delete()
      .from(PostEntity)
      .where('id = :id', { id });

    if (isAdmin) await qb.execute();
    else {
      const postToRemove = await this.postRepository
        .createQueryBuilder('post')
        .leftJoin('post.user', 'user')
        .where('post.id = :id', { id })
        .select('post.id', 'postId')
        .addSelect('user.id', 'userId')
        // <=> .select(['post.id AS "postId"', 'user.id AS "userID"'])
        .getRawOne();
      /**
       * select(column, alias)
       * getRaw not get
       */
      if (postToRemove.userId === userId) await qb.execute();
      else throw new UnauthorizedException();
    }
  }
}
