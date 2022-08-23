import { Module } from '@nestjs/common';
import { HeartsService } from './hearts.service';
import { HeartsController } from './hearts.controller';
import { PostsModule } from 'posts/posts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HeartEntity } from './entities/heart.entity';

@Module({
  controllers: [HeartsController],
  providers: [HeartsService],
  imports: [PostsModule, TypeOrmModule.forFeature([HeartEntity])],
})
export class HeartsModule {}
