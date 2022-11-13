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

  constructor(
    userId: number,
    bookInfoId: number,
    isDeleted: boolean,
  )
  {
    this.userId = userId;
    this.bookInfoId = bookInfoId;
    this.isDeleted = false;
  }
}
