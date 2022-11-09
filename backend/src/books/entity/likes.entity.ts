import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Likes {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  bookInfoId!: number;

  @Column()
  userId!: number;

  @Column()
  isDeleted!: boolean;
}
