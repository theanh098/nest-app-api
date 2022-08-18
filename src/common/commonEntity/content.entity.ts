import { Column, PrimaryGeneratedColumn } from 'typeorm';

export abstract class ContentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;
}
