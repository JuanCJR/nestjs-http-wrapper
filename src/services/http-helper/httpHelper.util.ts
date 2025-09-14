import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  GoneException,
  HttpException,
  HttpStatus,
  ImATeapotException,
  Injectable,
  InternalServerErrorException,
  Logger,
  MethodNotAllowedException,
  NotAcceptableException,
  NotFoundException,
  PayloadTooLargeException,
  RequestTimeoutException,
  ServiceUnavailableException,
  UnauthorizedException,
  UnprocessableEntityException,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { ErrorResponseDto, ErrorFormatConfig } from '../../dto/';

class TooManyRequestsException extends HttpException {
  constructor(response: ErrorResponseDto) {
    super(response, HttpStatus.TOO_MANY_REQUESTS);
  }
}

@Injectable()
export class HttpErrorHelper {
  private readonly logger = new Logger(HttpErrorHelper.name);

  validateResponse<T>(
    { data, status, statusText }: AxiosResponse<T>,
    provider: string,
  ): T {
    if (status === HttpStatus.OK || status === HttpStatus.CREATED) {
      return data;
    }

    const errorResponse: ErrorResponseDto = {
      message: statusText,
      status,
      provider,
      response: data || null,
    };

    this.handleHttpError(status, errorResponse);
  }

  handleHttpError(
    statusCode: HttpStatus,
    errorResponse: ErrorResponseDto,
  ): never {
    const exceptionMap: Record<
      number,
      new (response: ErrorResponseDto) => Error
    > = {
      // 4xx Client Errors
      [HttpStatus.BAD_REQUEST]: BadRequestException,
      [HttpStatus.UNAUTHORIZED]: UnauthorizedException,
      [HttpStatus.FORBIDDEN]: ForbiddenException,
      [HttpStatus.NOT_FOUND]: NotFoundException,
      [HttpStatus.METHOD_NOT_ALLOWED]: MethodNotAllowedException,
      [HttpStatus.NOT_ACCEPTABLE]: NotAcceptableException,
      [HttpStatus.REQUEST_TIMEOUT]: RequestTimeoutException,
      [HttpStatus.CONFLICT]: ConflictException,
      [HttpStatus.GONE]: GoneException,
      [HttpStatus.PAYLOAD_TOO_LARGE]: PayloadTooLargeException,
      [HttpStatus.UNSUPPORTED_MEDIA_TYPE]: UnsupportedMediaTypeException,
      [HttpStatus.I_AM_A_TEAPOT]: ImATeapotException,
      [HttpStatus.UNPROCESSABLE_ENTITY]: UnprocessableEntityException,
      [HttpStatus.TOO_MANY_REQUESTS]: TooManyRequestsException,
      // 5xx Server Errors
      [HttpStatus.INTERNAL_SERVER_ERROR]: InternalServerErrorException,
      [HttpStatus.SERVICE_UNAVAILABLE]: ServiceUnavailableException,
    };

    const ExceptionClass =
      exceptionMap[statusCode] || InternalServerErrorException;

    this.logger.error('Api Provider Error', JSON.stringify(errorResponse));
    throw new ExceptionClass(errorResponse);
  }

  /**
   * Specific method for handling errors with custom configuration
   * @param statusCode - HTTP status code
   * @param provider - API provider name
   * @param errorConfig - Custom configuration for the error
   * @param originalData - Original response data (optional)
   */
  handleCustomError(
    statusCode: HttpStatus,
    provider: string,
    errorConfig: ErrorFormatConfig,
    originalData?: any,
  ): never {
    const errorResponse: ErrorResponseDto = {
      message: errorConfig.customMessage || 'Error occurred',
      status: statusCode,
      provider,
      response: originalData || null,
      ...(errorConfig.customCode && { code: errorConfig.customCode }),
      ...(errorConfig.additionalFields || {}),
    };

    this.handleHttpError(statusCode, errorResponse);
  }
}
