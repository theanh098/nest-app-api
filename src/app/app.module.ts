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
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
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
