import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Reservation {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  status!: number;

  @Column()
  userId!: number;

  @Column()
  bookInfoId!: number;

  @Column()
  bookId!: number;

  @Column()
  endAt!: Date;

  @Column()
  createdAt!: Date;

  @Column()
  updatedAt!: Date;
}
