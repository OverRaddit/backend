import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Reviews {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  userId!: number;

  @Column()
  bookInfoId!: number;

  @Column()
  createdAt!: Date;

  @Column()
  updatedAt!: Date;

  @Column()
  updateUserId!: number;

  @Column()
  isDeleted!: boolean;

  @Column()
  deleteUserId!: string;

  @Column()
  content!: string;
  
  constructor(
    userId: number,
    bookInfoId: number,
    content: string
  ){this.userId = userId;
    this.bookInfoId = bookInfoId;
    this.updateUserId = userId;
    this.isDeleted = false;
    this.content = content;
}
}