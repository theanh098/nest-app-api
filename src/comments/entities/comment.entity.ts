import { PostEntity } from 'posts/entities/post.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from 'users/entities/user.entity';

@Entity()
export class CommentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @ManyToOne(() => PostEntity, post => post.comments)
  post: PostEntity;

  @ManyToOne(() => UserEntity)
  user: UserEntity;
}
