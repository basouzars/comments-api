import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './comment.entity';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @ApiOperation({ summary: 'Create a new comment' })
  @ApiResponse({
    status: 201,
    description: 'Comment created successfully.',
    type: Comment,
  })
  @Post()
  create(@Body() createCommentDto: CreateCommentDto): Promise<Comment> {
    return this.commentsService.create(createCommentDto);
  }

  @ApiOperation({
    summary: 'Get all comments by request ID and module',
    description:
      'Retrieve all comments associated with a specific request ID and module name.',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns comments for a specific request ID and module.',
    type: [Comment],
  })
  @Get()
  findAllByRequestAndModule(
    @Query('requestId') requestId: string,
    @Query('module') module: string,
  ): Promise<Comment[]> {
    if (!requestId || !module) {
      throw new BadRequestException('Request ID and module name are required.');
    }
    return this.commentsService.findAllByRequestAndModule(requestId, module);
  }

  @ApiOperation({ summary: 'Update a comment by ID' })
  @ApiResponse({ status: 200, description: 'Comment updated successfully.' })
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ): Promise<Comment> {
    return this.commentsService.update(id, updateCommentDto);
  }

  @ApiOperation({ summary: 'Remove a comment by ID' })
  @ApiResponse({ status: 200, description: 'Comment removed successfully.' })
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Query('userId') userId: string,
  ): Promise<void> {
    return this.commentsService.remove(id, userId);
  }
}
