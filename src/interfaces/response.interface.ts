import { ApiProperty } from "@nestjs/swagger";
import { GenericError } from "./error.interface";

export class GenericResponse<T> {
  @ApiProperty()
  data: T | null;

  @ApiProperty({ required: false })
  error?: GenericError;

  @ApiProperty()
  success: boolean;

  @ApiProperty()
  timestamp: string;
}
