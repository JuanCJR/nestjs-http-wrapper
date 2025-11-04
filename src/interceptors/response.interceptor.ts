import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GenericResponse } from '../interfaces/response.interface';

export interface ResponseInterceptorOptions {
  includeSuccess?: boolean;
  includeTimestamp?: boolean;
}

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, GenericResponse<T>>
{
  private readonly includeSuccess: boolean;
  private readonly includeTimestamp: boolean;

  constructor(options?: ResponseInterceptorOptions) {
    this.includeSuccess = options?.includeSuccess ?? false;
    this.includeTimestamp = options?.includeTimestamp ?? false;
  }

  intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<GenericResponse<T>> {
    return next.handle().pipe(
      map((data: T) => {
        const response: GenericResponse<T> = { data };

        if (this.includeSuccess) {
          response.success = true;
        }

        if (this.includeTimestamp) {
          response.timestamp = new Date().toISOString();
        }

        return response;
      }),
    );
  }
}
