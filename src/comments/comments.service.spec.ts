import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentsService } from './comments.service';
import { Comment } from './comment.entity';
import { CommentHistory } from './comment-history.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

jest.mock('sanitize-html');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const sanitizeHtml = require('sanitize-html');

describe('CommentsService', () => {
  let service: CommentsService;
  let commentsRepository: Repository<Comment>;
  let commentsHistoryRepository: Repository<CommentHistory>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        {
          provide: getRepositoryToken(Comment),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(CommentHistory),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<CommentsService>(CommentsService);
    commentsRepository = module.get<Repository<Comment>>(
      getRepositoryToken(Comment),
    );
    commentsHistoryRepository = module.get<Repository<CommentHistory>>(
      getRepositoryToken(CommentHistory),
    );
  });

  describe('create', () => {
    it('should sanitize and create a comment', async () => {
      const createCommentDto: CreateCommentDto = {
        module: 'module',
        requestId: 'request-id',
        userId: 'userId',
        userName: 'userName',
        comment: '<script>alert("xss")</script>',
        parentCommentId: null,
      };
      const sanitizedComment = 'sanitized comment';
      const comment = new Comment();

      sanitizeHtml.mockImplementation(() => sanitizedComment);
      jest.spyOn(commentsRepository, 'create').mockReturnValue(comment);
      jest.spyOn(commentsRepository, 'save').mockResolvedValue(comment);

      const result = await service.create(createCommentDto);

      expect(sanitizeHtml).toHaveBeenCalledWith(createCommentDto.comment);
      expect(commentsRepository.create).toHaveBeenCalledWith({
        ...createCommentDto,
        comment: sanitizedComment,
      });
      expect(commentsRepository.save).toHaveBeenCalledWith(comment);
      expect(result).toBe(comment);
    });

    it('should throw BadRequestException if parent comment does not exist', async () => {
      const createCommentDto: CreateCommentDto = {
        module: 'module',
        requestId: 'request-id',
        userId: 'userId',
        userName: 'userName',
        comment: 'test',
        parentCommentId: 'invalid-id',
      };
      jest.spyOn(commentsRepository, 'existsBy').mockResolvedValue(false);

      await expect(service.create(createCommentDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findOne', () => {
    it('should return a comment by id', async () => {
      const comment = new Comment();
      jest.spyOn(commentsRepository, 'findOneBy').mockResolvedValue(comment);

      const result = await service.findOne('valid-id');

      expect(result).toBe(comment);
    });

    it('should return null if comment not found', async () => {
      jest.spyOn(commentsRepository, 'findOneBy').mockResolvedValue(null);

      const result = await service.findOne('invalid-id');

      expect(result).toBeNull();
    });
  });

  describe('findAllByRequestAndModule', () => {
    it('should return comments by requestId and module', async () => {
      const comments = [new Comment(), new Comment()];

      jest.spyOn(commentsRepository, 'find').mockResolvedValue(comments);

      const result = await service.findAllByRequestAndModule(
        'request-id',
        'module',
      );

      expect(result).toBe(comments);
    });
  });

  describe('update', () => {
    it('should sanitize and update a comment', async () => {
      const updateCommentDto: UpdateCommentDto = {
        comment: '<script>alert("xss")</script>',
        updatedByUserId: 'user-id',
      };
      const sanitizedComment = 'sanitized comment';
      const comment = new Comment();
      comment.userId = 'user-id';
      comment.deletedAt = null;

      sanitizeHtml.mockImplementation(() => sanitizedComment);
      jest.spyOn(service, 'findOne').mockResolvedValue(comment);
      jest.spyOn(commentsHistoryRepository, 'save').mockResolvedValue(null);
      jest.spyOn(commentsRepository, 'update').mockResolvedValue(null);

      const result = await service.update('comment-id', updateCommentDto);

      expect(sanitizeHtml).toHaveBeenCalledWith(updateCommentDto.comment);
      expect(commentsRepository.update).toHaveBeenCalledWith('comment-id', {
        ...updateCommentDto,
        comment: sanitizedComment,
        updatedByUserId: updateCommentDto.updatedByUserId,
        updatedAt: expect.any(Date),
      });
      expect(result).toBe(comment);
    });

    it('should throw NotFoundException if comment does not exist', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      await expect(
        service.update('invalid-id', {
          comment: 'test',
          updatedByUserId: 'user-id',
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw UnauthorizedException if user is not allowed to update', async () => {
      const comment = new Comment();
      comment.userId = 'different-user-id';
      comment.deletedAt = null;
      jest.spyOn(service, 'findOne').mockResolvedValue(comment);

      await expect(
        service.update('comment-id', {
          comment: 'test',
          updatedByUserId: 'user-id',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('remove', () => {
    it('should delete a comment', async () => {
      const comment = new Comment();
      comment.userId = 'user-id';
      comment.deletedAt = null;
      jest.spyOn(service, 'findOne').mockResolvedValue(comment);
      jest.spyOn(commentsRepository, 'update').mockResolvedValue(null);

      await service.remove('comment-id', 'user-id');

      expect(commentsRepository.update).toHaveBeenCalledWith('comment-id', {
        deletedAt: expect.any(Date),
        deletedByUserId: 'user-id',
      });
    });

    it('should throw NotFoundException if comment does not exist', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      await expect(service.remove('invalid-id', 'user-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw UnauthorizedException if user is not allowed to delete', async () => {
      const comment = new Comment();
      comment.userId = 'different-user-id';
      comment.deletedAt = null;

      jest.spyOn(service, 'findOne').mockResolvedValue(comment);

      await expect(service.remove('comment-id', 'user-id')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
