import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { HttpErrorHelper } from '../http-helper/httpHelper.util';
import { AxiosRequestConfig } from 'axios';

export type HttpRequestOptions<TRequest = unknown> = AxiosRequestConfig & {
  url: string;
  data?: TRequest;
  headers?: Record<string, string>;
  provider: string;
  params?: Record<string, unknown>;
};

@Injectable()
export class HttpServiceWrapper {
  constructor(
    private readonly httpService: HttpService,
    private readonly httpErrorHelper: HttpErrorHelper,
  ) {}

  async request<TResponse, TRequest = unknown>(
    options: HttpRequestOptions<TRequest>,
  ): Promise<TResponse> {
    const response = await lastValueFrom(
      this.httpService.request<TResponse>({
        validateStatus: () => true,
        ...options,
      }),
    );
    return this.httpErrorHelper.validateResponse(response, options.provider);
  }
}
