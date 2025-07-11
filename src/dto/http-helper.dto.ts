import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty()
  message: string;
  @ApiProperty()
  status: number;
  @ApiProperty()
  provider: string;
  @ApiProperty({ required: false })
  response?: any;
}
