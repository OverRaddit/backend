import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Lending {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  bookId!: string;

  @Column()
  userId!: number;

  @Column()
  lendingLibrarianId!: number;

  @Column()
  lendingCondition!: string;

  @Column()
  returningLibrarianId!: number;

  @Column()
  returningCondition!: string;

  @Column()
  returnedAt!: string;

  @Column()
  createdAt!: Date;

  @Column()
  updatedAt!: Date;
}
