import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { CommentHistory } from './comment-history.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import * as sanitizeHtml from 'sanitize-html';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
    @InjectRepository(CommentHistory)
    private commentsHistoryRepository: Repository<CommentHistory>,
  ) {}

  async create(createCommentDto: CreateCommentDto): Promise<Comment> {
    if (createCommentDto.parentCommentId) {
      const parentExists = await this.commentsRepository.existsBy({
        id: createCommentDto.parentCommentId,
      });
      if (!parentExists) {
        throw new BadRequestException('Replying to unknown comment.');
      }
    }
    const sanitizedComment = sanitizeHtml(createCommentDto.comment);
    const comment = this.commentsRepository.create({
      ...createCommentDto,
      comment: sanitizedComment,
    });
    return this.commentsRepository.save(comment);
  }

  findOne(id: string): Promise<Comment> {
    return this.commentsRepository.findOneBy({ id });
  }

  findAllByRequestAndModule(
    requestId: string,
    module: string,
  ): Promise<Comment[]> {
    return this.commentsRepository.find({
      where: { requestId, module, deletedAt: null },
    });
  }

  async update(
    id: string,
    updateCommentDto: UpdateCommentDto,
  ): Promise<Comment> {
    const comment = await this.findOne(id);

    if (comment === null || comment.deletedAt !== null) {
      throw new NotFoundException();
    }

    if (comment.userId !== updateCommentDto.updatedByUserId) {
      throw new UnauthorizedException(
        'You are not allowed to update this comment',
      );
    }

    await this.commentsHistoryRepository.save({
      commentId: comment.id,
      userId: comment.userId,
      comment: comment.comment,
      createdAt: comment.createdAt,
    });

    const sanitizedComment = sanitizeHtml(updateCommentDto.comment);
    await this.commentsRepository.update(id, {
      ...updateCommentDto,
      comment: sanitizedComment,
      updatedByUserId: updateCommentDto.updatedByUserId,
      updatedAt: new Date(),
    });

    return comment;
  }

  async remove(id: string, userId: string): Promise<void> {
    const comment = await this.findOne(id);
    if (comment === null || comment.deletedAt !== null) {
      throw new NotFoundException();
    }

    if (comment.userId !== userId) {
      throw new UnauthorizedException(
        'You are not allowed to delete this comment',
      );
    }

    await this.commentsRepository.update(id, {
      deletedAt: new Date(),
      deletedByUserId: userId,
    });
  }
}
