import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity()
export class Comment {
  @ApiProperty({ type: 'string', format: 'uuid' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  module: string;

  @ApiProperty()
  @Column()
  requestId: string;

  @ApiProperty()
  @Column()
  userId: string;

  @ApiProperty()
  @Column()
  userName: string;

  @ApiProperty()
  @Column('text')
  comment: string;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  updatedByUserId: string;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  deletedAt: Date;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  deletedByUserId: string;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  parentCommentId: string;

  @ManyToOne(() => Comment, (comment) => comment.id)
  parentComment: Comment;

  @OneToMany(() => Comment, (comment) => comment.parentComment)
  childComments: Comment[];
}
