import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { Comment } from './comment.entity';
import { CommentHistory } from './comment-history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, CommentHistory])],
  providers: [CommentsService],
  controllers: [CommentsController],
})
export class CommentsModule {}
