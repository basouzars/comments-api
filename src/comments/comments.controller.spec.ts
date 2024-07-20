import { Test, TestingModule } from '@nestjs/testing';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './comment.entity';
import {
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  GoneException,
} from '@nestjs/common';

describe('CommentsController', () => {
  let controller: CommentsController;
  let service: CommentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentsController],
      providers: [
        {
          provide: CommentsService,
          useValue: {
            create: jest.fn(),
            findAllByRequestAndModule: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CommentsController>(CommentsController);
    service = module.get<CommentsService>(CommentsService);
  });

  describe('create', () => {
    it('should create a new comment', async () => {
      const createCommentDto: CreateCommentDto = {
        comment: 'Test comment',
        userId: 'user-id',
        requestId: 'request-id',
        module: 'module',
        userName: 'userName',
      };
      const result: Comment = { id: '1', comment: 'Test comment' } as Comment;

      jest.spyOn(service, 'create').mockResolvedValue(result);

      expect(await controller.create(createCommentDto)).toBe(result);
    });
  });

  describe('findAllByRequestAndModule', () => {
    it('should return all comments for a given request ID and module', async () => {
      const result: Comment[] = [
        { id: '1', comment: 'Test comment' } as Comment,
      ];

      jest
        .spyOn(service, 'findAllByRequestAndModule')
        .mockResolvedValue(result);

      expect(
        await controller.findAllByRequestAndModule('requestId', 'module'),
      ).toBe(result);
    });

    it('should throw BadRequestException if requestId or module is missing', () => {
      expect(() => controller.findAllByRequestAndModule('', 'module')).toThrow(
        BadRequestException,
      );
      expect(() =>
        controller.findAllByRequestAndModule('requestId', ''),
      ).toThrow(BadRequestException);
    });
  });

  describe('update', () => {
    it('should update a comment', async () => {
      const updateCommentDto: UpdateCommentDto = {
        comment: 'Updated comment',
        updatedByUserId: 'user-id',
      };
      const result: Comment = {
        id: '1',
        comment: 'Updated comment',
        updatedByUserId: 'user-id',
        deletedAt: null,
      } as Comment;

      jest.spyOn(service, 'update').mockResolvedValue(result);

      expect(await controller.update('1', updateCommentDto)).toBe(result);
    });

    it('should throw NotFoundException if comment is not found', async () => {
      jest.spyOn(service, 'update').mockRejectedValue(new NotFoundException());

      await expect(
        controller.update('1', {} as UpdateCommentDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user does not have permission', async () => {
      jest.spyOn(service, 'update').mockRejectedValue(new ForbiddenException());

      await expect(
        controller.update('1', {} as UpdateCommentDto),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw GoneException if comment has been deleted', async () => {
      jest.spyOn(service, 'update').mockRejectedValue(new GoneException());

      await expect(
        controller.update('1', {} as UpdateCommentDto),
      ).rejects.toThrow(GoneException);
    });
  });

  describe('remove', () => {
    it('should remove a comment', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      expect(await controller.remove('1', 'userId')).toBeUndefined();
    });

    it('should throw NotFoundException if comment is not found', async () => {
      jest.spyOn(service, 'remove').mockRejectedValue(new NotFoundException());

      await expect(controller.remove('1', 'userId')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException if user does not have permission', async () => {
      jest.spyOn(service, 'remove').mockRejectedValue(new ForbiddenException());

      await expect(controller.remove('1', 'userId')).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should throw GoneException if comment has been deleted', async () => {
      jest.spyOn(service, 'remove').mockRejectedValue(new GoneException());

      await expect(controller.remove('1', 'userId')).rejects.toThrow(
        GoneException,
      );
    });
  });
});
