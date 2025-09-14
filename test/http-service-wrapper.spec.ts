import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import {
  HttpServiceWrapper,
  HttpRequestOptions,
} from '../src/services/http-service-wrapper/http-service-wrapper.utils';
import { HttpErrorHelper } from '../src/services/http-helper/httpHelper.util';
import { of } from 'rxjs';
import { AxiosResponse } from 'axios';

describe('HttpServiceWrapper', () => {
  let service: HttpServiceWrapper;
  let httpService: jest.Mocked<HttpService>;
  let httpErrorHelper: jest.Mocked<HttpErrorHelper>;

  beforeEach(async () => {
    const mockHttpService = {
      request: jest.fn(),
    };

    const mockHttpErrorHelper = {
      validateResponse: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HttpServiceWrapper,
        { provide: HttpService, useValue: mockHttpService },
        { provide: HttpErrorHelper, useValue: mockHttpErrorHelper },
      ],
    }).compile();

    service = module.get<HttpServiceWrapper>(HttpServiceWrapper);
    httpService = module.get(HttpService);
    httpErrorHelper = module.get(HttpErrorHelper);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('request', () => {
    it('should make a GET request successfully', async () => {
      const mockResponse: AxiosResponse = {
        data: { id: 1, name: 'Test' },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };

      const options: HttpRequestOptions = {
        method: 'get',
        url: 'https://api.test.com/users',
        provider: 'TestAPI',
      };

      httpService.request.mockReturnValue(of(mockResponse));
      httpErrorHelper.validateResponse.mockReturnValue(mockResponse.data);

      const result = await service.request(options);

      expect(httpService.request).toHaveBeenCalledWith({
        method: 'get',
        url: 'https://api.test.com/users',
        provider: 'TestAPI',
        validateStatus: expect.any(Function),
      });
      expect(httpErrorHelper.validateResponse).toHaveBeenCalledWith(
        mockResponse,
        'TestAPI',
      );
      expect(result).toEqual({ id: 1, name: 'Test' });
    });

    it('should make a POST request with data', async () => {
      const mockResponse: AxiosResponse = {
        data: { id: 2, name: 'Created User' },
        status: 201,
        statusText: 'Created',
        headers: {},
        config: {} as any,
      };

      const requestData = { name: 'New User', email: 'test@example.com' };
      const options: HttpRequestOptions = {
        method: 'post',
        url: 'https://api.test.com/users',
        data: requestData,
        provider: 'TestAPI',
      };

      httpService.request.mockReturnValue(of(mockResponse));
      httpErrorHelper.validateResponse.mockReturnValue(mockResponse.data);

      const result = await service.request(options);

      expect(httpService.request).toHaveBeenCalledWith({
        method: 'post',
        url: 'https://api.test.com/users',
        data: requestData,
        provider: 'TestAPI',
        validateStatus: expect.any(Function),
      });
      expect(result).toEqual({ id: 2, name: 'Created User' });
    });

    it('should make a PUT request with custom headers', async () => {
      const mockResponse: AxiosResponse = {
        data: { id: 1, name: 'Updated User' },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };

      const requestData = { name: 'Updated User' };
      const customHeaders = { Authorization: 'Bearer token123' };
      const options: HttpRequestOptions = {
        method: 'put',
        url: 'https://api.test.com/users/1',
        data: requestData,
        headers: customHeaders,
        provider: 'TestAPI',
      };

      httpService.request.mockReturnValue(of(mockResponse));
      httpErrorHelper.validateResponse.mockReturnValue(mockResponse.data);

      const result = await service.request(options);

      expect(httpService.request).toHaveBeenCalledWith({
        method: 'put',
        url: 'https://api.test.com/users/1',
        data: requestData,
        headers: {
          Authorization: 'Bearer token123',
        },
        provider: 'TestAPI',
        validateStatus: expect.any(Function),
      });
      expect(result).toEqual({ id: 1, name: 'Updated User' });
    });

    it('should make a DELETE request', async () => {
      const mockResponse: AxiosResponse = {
        data: { message: 'User deleted' },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };

      const options: HttpRequestOptions = {
        method: 'delete',
        url: 'https://api.test.com/users/1',
        provider: 'TestAPI',
      };

      httpService.request.mockReturnValue(of(mockResponse));
      httpErrorHelper.validateResponse.mockReturnValue(mockResponse.data);

      const result = await service.request(options);

      expect(httpService.request).toHaveBeenCalledWith({
        method: 'delete',
        url: 'https://api.test.com/users/1',
        provider: 'TestAPI',
        validateStatus: expect.any(Function),
      });
      expect(result).toEqual({ message: 'User deleted' });
    });

    it('should make a request with query parameters', async () => {
      const mockResponse: AxiosResponse = {
        data: [{ id: 1, name: 'User 1' }],
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };

      const queryParams = { page: 1, limit: 10, search: 'test' };
      const options: HttpRequestOptions = {
        method: 'get',
        url: 'https://api.test.com/users',
        params: queryParams,
        provider: 'TestAPI',
      };

      httpService.request.mockReturnValue(of(mockResponse));
      httpErrorHelper.validateResponse.mockReturnValue(mockResponse.data);

      const result = await service.request(options);

      expect(httpService.request).toHaveBeenCalledWith({
        method: 'get',
        url: 'https://api.test.com/users',
        params: queryParams,
        provider: 'TestAPI',
        validateStatus: expect.any(Function),
      });
      expect(result).toEqual([{ id: 1, name: 'User 1' }]);
    });

    it('should override default Content-Type header', async () => {
      const mockResponse: AxiosResponse = {
        data: 'File uploaded',
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };

      const options: HttpRequestOptions = {
        method: 'post',
        url: 'https://api.test.com/upload',
        data: new FormData(),
        headers: { 'Content-Type': 'multipart/form-data' },
        provider: 'TestAPI',
      };

      httpService.request.mockReturnValue(of(mockResponse));
      httpErrorHelper.validateResponse.mockReturnValue(mockResponse.data);

      await service.request(options);

      expect(httpService.request).toHaveBeenCalledWith({
        method: 'post',
        url: 'https://api.test.com/upload',
        data: expect.any(FormData),
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        provider: 'TestAPI',
        validateStatus: expect.any(Function),
      });
    });

    it('should handle validateStatus function correctly', async () => {
      const mockResponse: AxiosResponse = {
        data: { error: 'Not found' },
        status: 404,
        statusText: 'Not Found',
        headers: {},
        config: {} as any,
      };

      const options: HttpRequestOptions = {
        method: 'get',
        url: 'https://api.test.com/users/999',
        provider: 'TestAPI',
      };

      httpService.request.mockReturnValue(of(mockResponse));
      httpErrorHelper.validateResponse.mockReturnValue(mockResponse.data);

      await service.request(options);

      const requestCall = httpService.request.mock.calls[0][0];
      const validateStatusFn = requestCall.validateStatus;

      expect(validateStatusFn).toBeDefined();
      if (validateStatusFn) {
        expect(validateStatusFn(200)).toBe(true);
        expect(validateStatusFn(404)).toBe(true);
        expect(validateStatusFn(500)).toBe(true);
      }
    });

    it('should propagate errors from httpErrorHelper', async () => {
      const mockResponse: AxiosResponse = {
        data: { error: 'Not found' },
        status: 404,
        statusText: 'Not Found',
        headers: {},
        config: {} as any,
      };

      const options: HttpRequestOptions = {
        method: 'get',
        url: 'https://api.test.com/users/999',
        provider: 'TestAPI',
      };

      const notFoundError = new Error('Not Found');
      httpService.request.mockReturnValue(of(mockResponse));
      httpErrorHelper.validateResponse.mockImplementation(() => {
        throw notFoundError;
      });

      await expect(service.request(options)).rejects.toThrow('Not Found');
      expect(httpErrorHelper.validateResponse).toHaveBeenCalledWith(
        mockResponse,
        'TestAPI',
      );
    });
  });
});
