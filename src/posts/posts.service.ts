import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { PaginationQuery } from 'common/pagination/pagination.query';
import { Repository } from 'typeorm';
import { UserEntity } from 'users/entities/user.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { PostEntity } from './entities/post.entity';
// import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostEntity)
    private postRepository: Repository<PostEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async create(newPost: CreatePostDto, userId: number) {
    const author = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id: userId })
      .getOne();
    const post = plainToClass(PostEntity, { ...newPost, user: author });
    await this.postRepository.save(post);
  }

  async findAll(pagination?: PaginationQuery) {
    const { pageNumber, pageSize } = pagination;
    const qb = this.postRepository.createQueryBuilder('post');
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

  async remove(id: number) {
    const x = await this.postRepository
      .createQueryBuilder()
      .delete()
      .from(PostEntity)
      .where('id = :id', { id })
      .execute();

    console.log('x: ', x);
  }
}
