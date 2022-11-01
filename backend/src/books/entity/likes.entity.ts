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

  constructor(id: number, bookInfoId: number, userId: number, isDeleted: boolean) {
    this.id = id;
    this.bookInfoId = bookInfoId;
    this.userId = userId;
    this.isDeleted = isDeleted;
  }
}
