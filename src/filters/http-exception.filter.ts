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

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const errorResponse = exception.getResponse();

      if (typeof errorResponse === 'string') {
        message = errorResponse;
        error = exception.message;
      } else {
        // Manejo específico para ErrorResponseDto de HttpErrorHelper
        if (this.isErrorResponseDto(errorResponse)) {
          message = errorResponse.message;
          error = `API Error from ${errorResponse.provider}`;
          provider = errorResponse.provider;
        } else {
          message = (errorResponse as any).message ?? exception.message;
          error = (errorResponse as any).error ?? 'Http Exception';
        }
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
      ...(provider && { provider }), // Incluir provider si existe
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
        message: Array.isArray(message) ? message : [String(message)],
        error,
        ...errorDetails,
      },
      success: false,
      timestamp: errorDetails.timestamp,
    };

    response.status(status).json(errorResponse);
  }

  private isErrorResponseDto(obj: any): obj is ErrorResponseDto {
    return (
      obj &&
      typeof obj === 'object' &&
      'message' in obj &&
      'status' in obj &&
      'provider' in obj
    );
  }
}
