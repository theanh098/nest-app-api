import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'auth/auth.module';
import { CommentsModule } from 'comments/comments.module';
import { CommentEntity } from 'comments/entities/comment.entity';
import { HeartEntity } from 'hearts/entities/heart.entity';
import { HeartsModule } from 'hearts/hearts.module';
import { PostEntity } from 'posts/entities/post.entity';
import { PostsModule } from 'posts/posts.module';
import { UserEntity } from 'users/entities/user.entity';
import { UsersModule } from 'users/users.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'vitaminc',
      database: 'nextappdb',
      entities: [UserEntity, PostEntity, CommentEntity, HeartEntity],
      synchronize: true,
    }),
    PostsModule,
    UsersModule,
    CommentsModule,
    HeartsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
