import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { GenericResponse } from '../interfaces/response.interface';
import { ErrorResponseDto } from '../dto/http-helper.dto';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number;
    let message: string | object;
    let error: string;
    let provider: string | undefined;

    let additionalFields: Record<string, any> | undefined;
    let customCode: string | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const errorResponse = exception.getResponse();

      if (typeof errorResponse === 'string') {
        message = errorResponse;
        error = exception.message;
      } else if (this.isErrorResponseDto(errorResponse)) {
        // Specific handling for ErrorResponseDto from HttpErrorHelper
        message = errorResponse.message;
        error = `API Error from ${errorResponse.provider}`;
        provider = errorResponse.provider;

        // Extract additional fields and custom code from the error response
        const { code } = errorResponse;
        customCode = code;

        // Extract additional fields (everything except the standard ErrorResponseDto properties)
        const {
          message: _message,
          status: _status,
          provider: _provider,
          response: _response,
          code: _code,
          ...extraFields
        } = errorResponse;
        if (Object.keys(extraFields).length > 0) {
          additionalFields = extraFields;
        }
      } else {
        const errorObj = errorResponse as Record<string, unknown>;
        message = (errorObj['message'] as string) ?? exception.message;
        error = (errorObj['error'] as string) ?? 'Http Exception';
      }
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal server error';
      error = 'Internal Server Error';
    }

    const errorDetails = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      ...(provider && { provider }), // Include provider if exists
    };

    this.logger.error(
      `${request.method} ${request.url}`,
      JSON.stringify({
        ...errorDetails,
        message,
        stack: exception instanceof Error ? exception.stack : undefined,
      }),
    );

    const errorResponse: GenericResponse<null> = {
      data: null,
      error: {
        status,
        message: Array.isArray(message)
          ? message
          : [
              typeof message === 'object'
                ? JSON.stringify(message)
                : String(message),
            ],
        error,
        ...errorDetails,
        ...(customCode && { code: customCode }),
        ...(additionalFields && { additionalFields }),
      },
      success: false,
      timestamp: errorDetails.timestamp,
    };

    response.status(status).json(errorResponse);
  }

  private isErrorResponseDto(obj: unknown): obj is ErrorResponseDto {
    return (
      obj !== null &&
      typeof obj === 'object' &&
      'message' in obj &&
      'status' in obj &&
      'provider' in obj
    );
  }
}
