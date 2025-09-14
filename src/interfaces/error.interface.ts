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

  @ApiProperty({ required: false })
  provider?: string;

  @ApiProperty({ required: false })
  code?: string;

  @ApiProperty({ required: false })
  additionalFields?: Record<string, any>;
}
