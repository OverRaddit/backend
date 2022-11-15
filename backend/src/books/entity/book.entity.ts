import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  infoId!: string;

  @Column()
  donatorId!: number;

  @Column()
  callSign!: string;

  @Column()
  status!: number;

  @Column()
  createdAt!: Date;

  @Column()
  updatedAt!: Date;

  @Column()
  donator!: string;
}
