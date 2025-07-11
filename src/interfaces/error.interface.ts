import { ApiProperty } from '@nestjs/swagger';

/**
 * Default error interface
 */
export class GenericError {
  @ApiProperty()
  status: number;

  @ApiProperty()
  statusCode: number;

  @ApiProperty({ type: [String] })
  message: string | string[];

  @ApiProperty()
  error: string;

  @ApiProperty()
  timestamp: string;

  @ApiProperty()
  path: string;

  @ApiProperty()
  method: string;
}
