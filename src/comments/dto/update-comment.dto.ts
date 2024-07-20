import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCommentDto {
  @ApiProperty()
  @IsString()
  updatedByUserId: string;

  @ApiProperty()
  @IsString()
  comment: string;
}
