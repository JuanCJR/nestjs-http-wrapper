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
  @ApiProperty({
    required: false,
    description: 'Custom error code',
  })
  code?: string;
  [key: string]: any; // Allow additional properties
}

/**
 * Configuration for customizing error response format
 */
export interface ErrorFormatConfig {
  customMessage?: string;
  customCode?: string;
  additionalFields?: Record<string, any>;
}
