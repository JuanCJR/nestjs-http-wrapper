import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GenericResponse } from '../interfaces/response.interface';

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, GenericResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<GenericResponse<T>> {
    return next.handle().pipe(
      map(
        (data: T) =>
          ({
            data,
            success: true,
            timestamp: new Date().toISOString(),
          }) as GenericResponse<T>,
      ),
    );
  }
}
