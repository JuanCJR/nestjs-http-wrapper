import { Test, TestingModule } from '@nestjs/testing';
import {
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { HttpExceptionFilter } from '../src/filters/http-exception.filter';
import { ErrorResponseDto } from '../src/dto/http-helper.dto';

describe('HttpExceptionFilter', () => {
  let filter: HttpExceptionFilter;
  let mockArgumentsHost: ArgumentsHost;
  let mockResponse: Response;
  let mockRequest: Request;
  let loggerSpy: jest.SpyInstance;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HttpExceptionFilter],
    }).compile();

    filter = module.get<HttpExceptionFilter>(HttpExceptionFilter);

    // Mock Express Response
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as any;

    // Mock Express Request
    mockRequest = {
      url: '/test',
      method: 'GET',
    } as any;

    // Mock ArgumentsHost
    mockArgumentsHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: jest.fn().mockReturnValue(mockResponse),
        getRequest: jest.fn().mockReturnValue(mockRequest),
      }),
    } as any;

    loggerSpy = jest.spyOn(Logger.prototype, 'error').mockImplementation();

    // Mock Date
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-01-01T00:00:00.000Z'));
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it('should be defined', () => {
    expect(filter).toBeDefined();
  });

  describe('catch', () => {
    it('should handle HttpException with string response', () => {
      // Arrange
      const exception = new HttpException('Test error', HttpStatus.BAD_REQUEST);

      // Act
      filter.catch(exception, mockArgumentsHost);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalledWith({
        data: null,
        error: {
          status: HttpStatus.BAD_REQUEST,
          message: ['Test error'],
          error: 'Test error',
          statusCode: HttpStatus.BAD_REQUEST,
          timestamp: '2024-01-01T00:00:00.000Z',
          path: '/test',
          method: 'GET',
        },
        success: false,
        timestamp: '2024-01-01T00:00:00.000Z',
      });
    });

    it('should handle HttpException with ErrorResponseDto', () => {
      // Arrange
      const errorDto: ErrorResponseDto = {
        message: 'API Error',
        status: HttpStatus.NOT_FOUND,
        provider: 'test-provider',
      };
      const exception = new HttpException(errorDto, HttpStatus.NOT_FOUND);

      // Act
      filter.catch(exception, mockArgumentsHost);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(mockResponse.json).toHaveBeenCalledWith({
        data: null,
        error: {
          status: HttpStatus.NOT_FOUND,
          message: ['API Error'],
          error: 'API Error from test-provider',
          statusCode: HttpStatus.NOT_FOUND,
          timestamp: '2024-01-01T00:00:00.000Z',
          path: '/test',
          method: 'GET',
          provider: 'test-provider',
        },
        success: false,
        timestamp: '2024-01-01T00:00:00.000Z',
      });
    });

    it('should handle HttpException with ErrorResponseDto including custom code and additional fields', () => {
      // Arrange
      const errorDto: ErrorResponseDto = {
        message:
          'No encontramos esta tienda. Vuelve al inicio e intenta nuevamente.',
        status: HttpStatus.NOT_FOUND,
        provider: 'hub-bff',
        code: 'store_not_found',
        facilityId: '3661',
        country: 'CL',
        xCommerce: 'ecommerce',
      };
      const exception = new HttpException(errorDto, HttpStatus.NOT_FOUND);

      // Act
      filter.catch(exception, mockArgumentsHost);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(mockResponse.json).toHaveBeenCalledWith({
        data: null,
        error: {
          status: HttpStatus.NOT_FOUND,
          message: [
            'No encontramos esta tienda. Vuelve al inicio e intenta nuevamente.',
          ],
          error: 'API Error from hub-bff',
          statusCode: HttpStatus.NOT_FOUND,
          timestamp: '2024-01-01T00:00:00.000Z',
          path: '/test',
          method: 'GET',
          provider: 'hub-bff',
          code: 'store_not_found',
          additionalFields: {
            facilityId: '3661',
            country: 'CL',
            xCommerce: 'ecommerce',
          },
        },
        success: false,
        timestamp: '2024-01-01T00:00:00.000Z',
      });
    });

    it('should handle HttpException with object response', () => {
      // Arrange
      const errorResponse = {
        message: 'Validation failed',
        error: 'Bad Request',
      };
      const exception = new HttpException(
        errorResponse,
        HttpStatus.BAD_REQUEST,
      );

      // Act
      filter.catch(exception, mockArgumentsHost);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalledWith({
        data: null,
        error: {
          status: HttpStatus.BAD_REQUEST,
          message: ['Validation failed'],
          error: 'Bad Request',
          statusCode: HttpStatus.BAD_REQUEST,
          timestamp: '2024-01-01T00:00:00.000Z',
          path: '/test',
          method: 'GET',
        },
        success: false,
        timestamp: '2024-01-01T00:00:00.000Z',
      });
    });

    it('should handle non-HttpException errors', () => {
      // Arrange
      const exception = new Error('Unexpected error');

      // Act
      filter.catch(exception, mockArgumentsHost);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      expect(mockResponse.json).toHaveBeenCalledWith({
        data: null,
        error: {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: ['Internal server error'],
          error: 'Internal Server Error',
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          timestamp: '2024-01-01T00:00:00.000Z',
          path: '/test',
          method: 'GET',
        },
        success: false,
        timestamp: '2024-01-01T00:00:00.000Z',
      });
    });

    it('should log error details', () => {
      // Arrange
      const exception = new HttpException('Test error', HttpStatus.BAD_REQUEST);

      // Act
      filter.catch(exception, mockArgumentsHost);

      // Assert
      expect(loggerSpy).toHaveBeenCalledWith(
        'GET /test',
        expect.stringContaining('"message":"Test error"'),
      );
    });

    it('should include stack trace for Error instances', () => {
      // Arrange
      const exception = new Error('Test error');

      // Act
      filter.catch(exception, mockArgumentsHost);

      // Assert
      expect(loggerSpy).toHaveBeenCalledWith(
        'GET /test',
        expect.stringContaining('"stack":'),
      );
    });
  });

  describe('isErrorResponseDto', () => {
    it('should identify valid ErrorResponseDto', () => {
      // Arrange
      const validDto = {
        message: 'Test message',
        status: HttpStatus.BAD_REQUEST,
        provider: 'test-provider',
      };

      // Act
      const result = (filter as any).isErrorResponseDto(validDto);

      // Assert
      expect(result).toBe(true);
    });

    it('should reject invalid objects', () => {
      // Arrange
      const invalidDto = {
        message: 'Test message',
        // missing status and provider
      };

      // Act
      const result = (filter as any).isErrorResponseDto(invalidDto);

      // Assert
      expect(result).toBe(false);
    });

    it('should reject null or undefined', () => {
      // Act & Assert
      const result1 = (filter as any).isErrorResponseDto(null);
      const result2 = (filter as any).isErrorResponseDto(undefined);

      expect(result1).toBeFalsy();
      expect(result2).toBeFalsy();
    });
  });
});
