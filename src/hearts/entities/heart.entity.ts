import { PostEntity } from 'posts/entities/post.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from 'users/entities/user.entity';

@Entity()
export class HeartEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity)
  user: UserEntity;

  @ManyToOne(() => PostEntity)
  post: PostEntity;
}
