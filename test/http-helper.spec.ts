import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  GoneException,
  HttpException,
  HttpStatus,
  ImATeapotException,
  InternalServerErrorException,
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
import { HttpErrorHelper } from '../src/services/http-helper/httpHelper.util';
import { AxiosResponse } from 'axios';
import { ErrorResponseDto } from '../src/dto/http-helper.dto';

describe('HttpErrorHelper', () => {
  let service: HttpErrorHelper;
  let loggerSpy: jest.SpyInstance;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HttpErrorHelper],
    }).compile();

    service = module.get<HttpErrorHelper>(HttpErrorHelper);
    loggerSpy = jest.spyOn(service['logger'], 'error').mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateResponse', () => {
    it('should return data when status is OK', () => {
      const mockResponse: Partial<AxiosResponse> = {
        data: { test: 'data' },
        status: HttpStatus.OK,
        statusText: 'OK',
      };

      const result = service.validateResponse(
        mockResponse as AxiosResponse,
        'TestProvider',
      );

      expect(result).toEqual({ test: 'data' });
    });

    it('should return data when status is CREATED', () => {
      const mockResponse: Partial<AxiosResponse> = {
        data: { test: 'created' },
        status: HttpStatus.CREATED,
        statusText: 'Created',
      };

      const result = service.validateResponse(
        mockResponse as AxiosResponse,
        'TestProvider',
      );

      expect(result).toEqual({ test: 'created' });
    });

    it('should throw NotFoundException when status is NOT_FOUND', () => {
      const mockResponse: Partial<AxiosResponse> = {
        data: { error: 'Resource not found' },
        status: HttpStatus.NOT_FOUND,
        statusText: 'Not Found',
      };

      expect(() =>
        service.validateResponse(mockResponse as AxiosResponse, 'TestProvider'),
      ).toThrow(NotFoundException);
      expect(loggerSpy).toHaveBeenCalledWith(
        'Api Provider Error',
        JSON.stringify({
          message: 'Not Found',
          status: HttpStatus.NOT_FOUND,
          provider: 'TestProvider',
          response: { error: 'Resource not found' },
        }),
      );
    });

    it('should throw BadRequestException when status is BAD_REQUEST', () => {
      const mockResponse: Partial<AxiosResponse> = {
        data: { error: 'Invalid request' },
        status: HttpStatus.BAD_REQUEST,
        statusText: 'Bad Request',
      };

      expect(() =>
        service.validateResponse(mockResponse as AxiosResponse, 'TestProvider'),
      ).toThrow(BadRequestException);
    });

    it('should throw UnauthorizedException when status is UNAUTHORIZED', () => {
      const mockResponse: Partial<AxiosResponse> = {
        data: { error: 'Unauthorized access' },
        status: HttpStatus.UNAUTHORIZED,
        statusText: 'Unauthorized',
      };

      expect(() =>
        service.validateResponse(mockResponse as AxiosResponse, 'TestProvider'),
      ).toThrow(UnauthorizedException);
    });

    it('should throw InternalServerErrorException when status is INTERNAL_SERVER_ERROR', () => {
      const mockResponse: Partial<AxiosResponse> = {
        data: { error: 'Server error' },
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        statusText: 'Internal Server Error',
      };

      expect(() =>
        service.validateResponse(mockResponse as AxiosResponse, 'TestProvider'),
      ).toThrow(InternalServerErrorException);
    });

    it('should handle response with null data', () => {
      const mockResponse: Partial<AxiosResponse> = {
        data: null,
        status: HttpStatus.NOT_FOUND,
        statusText: 'Not Found',
      };

      expect(() =>
        service.validateResponse(mockResponse as AxiosResponse, 'TestProvider'),
      ).toThrow(NotFoundException);
      expect(loggerSpy).toHaveBeenCalledWith(
        'Api Provider Error',
        JSON.stringify({
          message: 'Not Found',
          status: HttpStatus.NOT_FOUND,
          provider: 'TestProvider',
          response: null,
        }),
      );
    });

    it('should handle response with undefined data', () => {
      const mockResponse: Partial<AxiosResponse> = {
        data: undefined,
        status: HttpStatus.BAD_REQUEST,
        statusText: 'Bad Request',
      };

      expect(() =>
        service.validateResponse(mockResponse as AxiosResponse, 'TestProvider'),
      ).toThrow(BadRequestException);
      expect(loggerSpy).toHaveBeenCalledWith(
        'Api Provider Error',
        JSON.stringify({
          message: 'Bad Request',
          status: HttpStatus.BAD_REQUEST,
          provider: 'TestProvider',
          response: null,
        }),
      );
    });

    it('should throw ForbiddenException when status is FORBIDDEN', () => {
      const mockResponse: Partial<AxiosResponse> = {
        data: { error: 'Access forbidden' },
        status: HttpStatus.FORBIDDEN,
        statusText: 'Forbidden',
      };

      expect(() =>
        service.validateResponse(mockResponse as AxiosResponse, 'TestProvider'),
      ).toThrow(ForbiddenException);
    });

    it('should throw MethodNotAllowedException when status is METHOD_NOT_ALLOWED', () => {
      const mockResponse: Partial<AxiosResponse> = {
        data: { error: 'Method not allowed' },
        status: HttpStatus.METHOD_NOT_ALLOWED,
        statusText: 'Method Not Allowed',
      };

      expect(() =>
        service.validateResponse(mockResponse as AxiosResponse, 'TestProvider'),
      ).toThrow(MethodNotAllowedException);
    });

    it('should throw NotAcceptableException when status is NOT_ACCEPTABLE', () => {
      const mockResponse: Partial<AxiosResponse> = {
        data: { error: 'Not acceptable' },
        status: HttpStatus.NOT_ACCEPTABLE,
        statusText: 'Not Acceptable',
      };

      expect(() =>
        service.validateResponse(mockResponse as AxiosResponse, 'TestProvider'),
      ).toThrow(NotAcceptableException);
    });

    it('should throw RequestTimeoutException when status is REQUEST_TIMEOUT', () => {
      const mockResponse: Partial<AxiosResponse> = {
        data: { error: 'Request timeout' },
        status: HttpStatus.REQUEST_TIMEOUT,
        statusText: 'Request Timeout',
      };

      expect(() =>
        service.validateResponse(mockResponse as AxiosResponse, 'TestProvider'),
      ).toThrow(RequestTimeoutException);
    });

    it('should throw ConflictException when status is CONFLICT', () => {
      const mockResponse: Partial<AxiosResponse> = {
        data: { error: 'Resource conflict' },
        status: HttpStatus.CONFLICT,
        statusText: 'Conflict',
      };

      expect(() =>
        service.validateResponse(mockResponse as AxiosResponse, 'TestProvider'),
      ).toThrow(ConflictException);
    });

    it('should throw GoneException when status is GONE', () => {
      const mockResponse: Partial<AxiosResponse> = {
        data: { error: 'Resource gone' },
        status: HttpStatus.GONE,
        statusText: 'Gone',
      };

      expect(() =>
        service.validateResponse(mockResponse as AxiosResponse, 'TestProvider'),
      ).toThrow(GoneException);
    });

    it('should throw PayloadTooLargeException when status is PAYLOAD_TOO_LARGE', () => {
      const mockResponse: Partial<AxiosResponse> = {
        data: { error: 'Payload too large' },
        status: HttpStatus.PAYLOAD_TOO_LARGE,
        statusText: 'Payload Too Large',
      };

      expect(() =>
        service.validateResponse(mockResponse as AxiosResponse, 'TestProvider'),
      ).toThrow(PayloadTooLargeException);
    });

    it('should throw UnsupportedMediaTypeException when status is UNSUPPORTED_MEDIA_TYPE', () => {
      const mockResponse: Partial<AxiosResponse> = {
        data: { error: 'Unsupported media type' },
        status: HttpStatus.UNSUPPORTED_MEDIA_TYPE,
        statusText: 'Unsupported Media Type',
      };

      expect(() =>
        service.validateResponse(mockResponse as AxiosResponse, 'TestProvider'),
      ).toThrow(UnsupportedMediaTypeException);
    });

    it('should throw ImATeapotException when status is I_AM_A_TEAPOT', () => {
      const mockResponse: Partial<AxiosResponse> = {
        data: { error: 'I am a teapot' },
        status: HttpStatus.I_AM_A_TEAPOT,
        statusText: "I'm a teapot",
      };

      expect(() =>
        service.validateResponse(mockResponse as AxiosResponse, 'TestProvider'),
      ).toThrow(ImATeapotException);
    });

    it('should throw UnprocessableEntityException when status is UNPROCESSABLE_ENTITY', () => {
      const mockResponse: Partial<AxiosResponse> = {
        data: { error: 'Unprocessable entity' },
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        statusText: 'Unprocessable Entity',
      };

      expect(() =>
        service.validateResponse(mockResponse as AxiosResponse, 'TestProvider'),
      ).toThrow(UnprocessableEntityException);
    });

    it('should throw TooManyRequestsException when status is TOO_MANY_REQUESTS', () => {
      const mockResponse: Partial<AxiosResponse> = {
        data: { error: 'Too many requests' },
        status: HttpStatus.TOO_MANY_REQUESTS,
        statusText: 'Too Many Requests',
      };

      expect(() =>
        service.validateResponse(mockResponse as AxiosResponse, 'TestProvider'),
      ).toThrow(HttpException);
    });

    it('should throw ServiceUnavailableException when status is SERVICE_UNAVAILABLE', () => {
      const mockResponse: Partial<AxiosResponse> = {
        data: { error: 'Service unavailable' },
        status: HttpStatus.SERVICE_UNAVAILABLE,
        statusText: 'Service Unavailable',
      };

      expect(() =>
        service.validateResponse(mockResponse as AxiosResponse, 'TestProvider'),
      ).toThrow(ServiceUnavailableException);
    });

    it('should throw InternalServerErrorException for truly unknown status codes', () => {
      const mockResponse: Partial<AxiosResponse> = {
        data: { error: 'Unknown error' },
        status: 999 as HttpStatus, // Status code not mapped
        statusText: 'Unknown Status',
      };

      expect(() =>
        service.validateResponse(mockResponse as AxiosResponse, 'TestProvider'),
      ).toThrow(InternalServerErrorException);
    });
  });

  describe('handleHttpError', () => {
    it('should throw NotFoundException when status is NOT_FOUND', () => {
      const errorResponse: ErrorResponseDto = {
        message: 'Not Found',
        status: HttpStatus.NOT_FOUND,
        provider: 'TestProvider',
      };

      expect(() =>
        service.handleHttpError(HttpStatus.NOT_FOUND, errorResponse),
      ).toThrow(NotFoundException);
      expect(loggerSpy).toHaveBeenCalledWith(
        'Api Provider Error',
        JSON.stringify(errorResponse),
      );
    });

    it('should throw BadRequestException when status is BAD_REQUEST', () => {
      const errorResponse: ErrorResponseDto = {
        message: 'Bad Request',
        status: HttpStatus.BAD_REQUEST,
        provider: 'TestProvider',
      };

      expect(() =>
        service.handleHttpError(HttpStatus.BAD_REQUEST, errorResponse),
      ).toThrow(BadRequestException);
    });

    it('should throw UnauthorizedException when status is UNAUTHORIZED', () => {
      const errorResponse: ErrorResponseDto = {
        message: 'Unauthorized',
        status: HttpStatus.UNAUTHORIZED,
        provider: 'TestProvider',
      };

      expect(() =>
        service.handleHttpError(HttpStatus.UNAUTHORIZED, errorResponse),
      ).toThrow(UnauthorizedException);
    });

    it('should throw InternalServerErrorException when status is INTERNAL_SERVER_ERROR', () => {
      const errorResponse: ErrorResponseDto = {
        message: 'Internal Server Error',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        provider: 'TestProvider',
      };

      expect(() =>
        service.handleHttpError(
          HttpStatus.INTERNAL_SERVER_ERROR,
          errorResponse,
        ),
      ).toThrow(InternalServerErrorException);
    });

    it('should throw ForbiddenException when status is FORBIDDEN', () => {
      const errorResponse: ErrorResponseDto = {
        message: 'Forbidden',
        status: HttpStatus.FORBIDDEN,
        provider: 'TestProvider',
      };

      expect(() =>
        service.handleHttpError(HttpStatus.FORBIDDEN, errorResponse),
      ).toThrow(ForbiddenException);
    });

    it('should throw MethodNotAllowedException when status is METHOD_NOT_ALLOWED', () => {
      const errorResponse: ErrorResponseDto = {
        message: 'Method Not Allowed',
        status: HttpStatus.METHOD_NOT_ALLOWED,
        provider: 'TestProvider',
      };

      expect(() =>
        service.handleHttpError(HttpStatus.METHOD_NOT_ALLOWED, errorResponse),
      ).toThrow(MethodNotAllowedException);
    });

    it('should throw NotAcceptableException when status is NOT_ACCEPTABLE', () => {
      const errorResponse: ErrorResponseDto = {
        message: 'Not Acceptable',
        status: HttpStatus.NOT_ACCEPTABLE,
        provider: 'TestProvider',
      };

      expect(() =>
        service.handleHttpError(HttpStatus.NOT_ACCEPTABLE, errorResponse),
      ).toThrow(NotAcceptableException);
    });

    it('should throw RequestTimeoutException when status is REQUEST_TIMEOUT', () => {
      const errorResponse: ErrorResponseDto = {
        message: 'Request Timeout',
        status: HttpStatus.REQUEST_TIMEOUT,
        provider: 'TestProvider',
      };

      expect(() =>
        service.handleHttpError(HttpStatus.REQUEST_TIMEOUT, errorResponse),
      ).toThrow(RequestTimeoutException);
    });

    it('should throw ConflictException when status is CONFLICT', () => {
      const errorResponse: ErrorResponseDto = {
        message: 'Conflict',
        status: HttpStatus.CONFLICT,
        provider: 'TestProvider',
      };

      expect(() =>
        service.handleHttpError(HttpStatus.CONFLICT, errorResponse),
      ).toThrow(ConflictException);
    });

    it('should throw GoneException when status is GONE', () => {
      const errorResponse: ErrorResponseDto = {
        message: 'Gone',
        status: HttpStatus.GONE,
        provider: 'TestProvider',
      };

      expect(() =>
        service.handleHttpError(HttpStatus.GONE, errorResponse),
      ).toThrow(GoneException);
    });

    it('should throw PayloadTooLargeException when status is PAYLOAD_TOO_LARGE', () => {
      const errorResponse: ErrorResponseDto = {
        message: 'Payload Too Large',
        status: HttpStatus.PAYLOAD_TOO_LARGE,
        provider: 'TestProvider',
      };

      expect(() =>
        service.handleHttpError(HttpStatus.PAYLOAD_TOO_LARGE, errorResponse),
      ).toThrow(PayloadTooLargeException);
    });

    it('should throw UnsupportedMediaTypeException when status is UNSUPPORTED_MEDIA_TYPE', () => {
      const errorResponse: ErrorResponseDto = {
        message: 'Unsupported Media Type',
        status: HttpStatus.UNSUPPORTED_MEDIA_TYPE,
        provider: 'TestProvider',
      };

      expect(() =>
        service.handleHttpError(
          HttpStatus.UNSUPPORTED_MEDIA_TYPE,
          errorResponse,
        ),
      ).toThrow(UnsupportedMediaTypeException);
    });

    it('should throw ImATeapotException when status is I_AM_A_TEAPOT', () => {
      const errorResponse: ErrorResponseDto = {
        message: "I'm a teapot",
        status: HttpStatus.I_AM_A_TEAPOT,
        provider: 'TestProvider',
      };

      expect(() =>
        service.handleHttpError(HttpStatus.I_AM_A_TEAPOT, errorResponse),
      ).toThrow(ImATeapotException);
    });

    it('should throw UnprocessableEntityException when status is UNPROCESSABLE_ENTITY', () => {
      const errorResponse: ErrorResponseDto = {
        message: 'Unprocessable Entity',
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        provider: 'TestProvider',
      };

      expect(() =>
        service.handleHttpError(HttpStatus.UNPROCESSABLE_ENTITY, errorResponse),
      ).toThrow(UnprocessableEntityException);
    });

    it('should throw TooManyRequestsException when status is TOO_MANY_REQUESTS', () => {
      const errorResponse: ErrorResponseDto = {
        message: 'Too Many Requests',
        status: HttpStatus.TOO_MANY_REQUESTS,
        provider: 'TestProvider',
      };

      expect(() =>
        service.handleHttpError(HttpStatus.TOO_MANY_REQUESTS, errorResponse),
      ).toThrow(HttpException);
    });

    it('should throw ServiceUnavailableException when status is SERVICE_UNAVAILABLE', () => {
      const errorResponse: ErrorResponseDto = {
        message: 'Service Unavailable',
        status: HttpStatus.SERVICE_UNAVAILABLE,
        provider: 'TestProvider',
      };

      expect(() =>
        service.handleHttpError(HttpStatus.SERVICE_UNAVAILABLE, errorResponse),
      ).toThrow(ServiceUnavailableException);
    });

    it('should throw InternalServerErrorException for truly unknown status codes', () => {
      const errorResponse: ErrorResponseDto = {
        message: 'Unknown Error',
        status: 999 as HttpStatus,
        provider: 'TestProvider',
      };

      expect(() =>
        service.handleHttpError(999 as HttpStatus, errorResponse),
      ).toThrow(InternalServerErrorException);
    });

    it('should log error details', () => {
      const errorResponse: ErrorResponseDto = {
        message: 'Test Error',
        status: HttpStatus.BAD_REQUEST,
        provider: 'TestProvider',
        response: { detail: 'Additional info' },
      };

      expect(() =>
        service.handleHttpError(HttpStatus.BAD_REQUEST, errorResponse),
      ).toThrow(BadRequestException);
      expect(loggerSpy).toHaveBeenCalledWith(
        'Api Provider Error',
        JSON.stringify(errorResponse),
      );
    });
  });
});
