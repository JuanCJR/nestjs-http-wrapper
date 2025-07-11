import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { HttpErrorHelper } from '../http-helper/httpHelper.util';

export type HttpRequestOptions<TRequest = unknown> = {
  method: 'get' | 'post' | 'put' | 'delete';
  url: string;
  data?: TRequest;
  headers?: Record<string, string>;
  provider: string;
  params?: Record<string, unknown>;
};

@Injectable()
export class HttpServiceWrapper {
  private readonly logger = new Logger(HttpServiceWrapper.name);

  constructor(
    private httpService: HttpService,
    private httpErrorHelper: HttpErrorHelper,
  ) {}

  async request<TResponse, TRequest = unknown>(
    options: HttpRequestOptions<TRequest>,
  ): Promise<TResponse> {
    const response = await lastValueFrom(
      this.httpService.request<TResponse>({
        method: options.method,
        url: options.url,
        data: options.data,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        params: options.params,
        validateStatus: () => true,
      }),
    );
    return this.httpErrorHelper.validateResponse(response, options.provider);
  }
}
