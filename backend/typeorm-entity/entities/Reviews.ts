import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";
import { BookInfo } from "./BookInfo";

@Index("FK_529dceb01ef681127fef04d755d3", ["userId"], {})
@Index("FK_bookInfo2", ["bookInfoId"], {})
@Entity("reviews", { schema: "jiphyeonjeon" })
export class Reviews {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "userId" })
  userId: number;

  @Column("int", { name: "bookInfoId" })
  bookInfoId: number;

  @Column("datetime", {
    name: "createdAt",
    default: () => "'CURRENT_TIMESTAMP(6)'",
  })
  createdAt: Date;

  @Column("datetime", {
    name: "updatedAt",
    default: () => "'CURRENT_TIMESTAMP(6)'",
  })
  updatedAt: Date;

  @Column("int", { name: "updateUserId" })
  updateUserId: number;

  @Column("tinyint", { name: "isDeleted", width: 1, default: () => "'0'" })
  isDeleted: boolean;

  @Column("int", { name: "deleteUserId", nullable: true })
  deleteUserId: number | null;

  @Column("varchar", { name: "content", length: 255 })
  content: string;

  @ManyToOne(() => User, (user) => user.reviews, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "userId", referencedColumnName: "id" }])
  user: User;

  @ManyToOne(() => BookInfo, (bookInfo) => bookInfo.reviews, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "bookInfoId", referencedColumnName: "id" }])
  bookInfo: BookInfo;
}
