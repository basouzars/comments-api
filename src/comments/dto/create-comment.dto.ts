import { IsString, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty()
  @IsString()
  module: string;

  @ApiProperty()
  @IsString()
  requestId: string;

  @ApiProperty()
  @IsString()
  userId: string;

  @ApiProperty()
  @IsString()
  userName: string;

  @ApiProperty()
  @IsString()
  comment: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  parentCommentId?: string;
}
