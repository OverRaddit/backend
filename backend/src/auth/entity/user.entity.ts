import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  email!: string;

  @Column()
  password!: string;

  @Column()
  nickname!: string;

  @Column()
  intraId!: number;

  @Column()
  slack!: string;

  @Column()
  penaltyEndDate!: Date;

  @Column()
  role!: number;

  @Column()
  createdAt!: Date;

  @Column()
  updatedAt!: Date;
}
