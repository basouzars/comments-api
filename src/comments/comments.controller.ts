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
import {
  ApiTags,
  ApiOperation,
  ApiNotFoundResponse,
  ApiGoneResponse,
  ApiForbiddenResponse,
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';

@ApiTags('Comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @ApiOperation({ summary: 'Create a new comment' })
  @ApiCreatedResponse({
    status: 201,
    description: 'Comment created successfully.',
    type: Comment,
  })
  @ApiBadRequestResponse({ description: 'An input error has happened.' })
  @Post()
  create(@Body() createCommentDto: CreateCommentDto): Promise<Comment> {
    return this.commentsService.create(createCommentDto);
  }

  @ApiOperation({
    summary: 'Get all comments by request ID and module',
    description:
      'Retrieve all comments associated with a specific request ID and module name.',
  })
  @ApiOkResponse({
    description: 'Returns comments for a specific request ID and module.',
    type: [Comment],
  })
  @ApiBadRequestResponse({
    description: 'Request ID and module name required.',
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
  @ApiOkResponse({ description: 'Comment updated successfully.' })
  @ApiForbiddenResponse({ description: 'User does not have permission.' })
  @ApiNotFoundResponse({ description: 'Comment not found.' })
  @ApiGoneResponse({ description: 'Comment has already been deleted.' })
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ): Promise<Comment> {
    return this.commentsService.update(id, updateCommentDto);
  }

  @ApiOperation({ summary: 'Remove a comment by ID' })
  @ApiOkResponse({ description: 'Comment removed successfully.' })
  @ApiForbiddenResponse({ description: 'User does not have permission.' })
  @ApiNotFoundResponse({ description: 'Comment not found.' })
  @ApiGoneResponse({ description: 'Comment has already been deleted.' })
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Query('userId') userId: string,
  ): Promise<void> {
    return this.commentsService.remove(id, userId);
  }
}
