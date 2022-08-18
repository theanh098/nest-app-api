import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { ContentEntity } from 'common/commonEntity/content.entity';
import { CommentEntity } from 'comments/entities/comment.entity';
import { UserEntity } from 'users/entities/user.entity';

@Entity()
export class PostEntity extends ContentEntity {
  @Column()
  imgURL: string;

  @OneToMany(() => CommentEntity, comment => comment.post)
  comments: CommentEntity[];

  @ManyToOne(() => UserEntity)
  user: UserEntity;
}
