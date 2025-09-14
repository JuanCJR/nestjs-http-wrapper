import { Test, TestingModule } from '@nestjs/testing';
import { HttpErrorHelper } from '../src/services/http-helper/httpHelper.util';
import {
  BadRequestException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { ErrorFormatConfig } from '../src/dto/http-helper.dto';

describe('HttpErrorHelper - handleCustomError', () => {
  let service: HttpErrorHelper;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HttpErrorHelper],
    }).compile();

    service = module.get<HttpErrorHelper>(HttpErrorHelper);
  });

  it('should throw NotFoundException with custom message and code', () => {
    const errorConfig: ErrorFormatConfig = {
      customMessage:
        'No encontramos esta tienda. Vuelve al inicio e intenta nuevamente.',
      customCode: 'store_not_found',
    };

    expect(() => {
      service.handleCustomError(
        HttpStatus.NOT_FOUND,
        'Store API',
        errorConfig,
        { storeId: '123' },
      );
    }).toThrow(NotFoundException);
  });

  it('should throw BadRequestException with custom message and code', () => {
    const errorConfig: ErrorFormatConfig = {
      customMessage: 'La categoría especificada no es válida.',
      customCode: 'invalid_category',
    };

    expect(() => {
      service.handleCustomError(
        HttpStatus.BAD_REQUEST,
        'Store API',
        errorConfig,
      );
    }).toThrow(BadRequestException);
  });

  it('should use default message when customMessage is not provided', () => {
    const errorConfig: ErrorFormatConfig = {
      customCode: 'generic_error',
    };

    expect(() => {
      service.handleCustomError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Store API',
        errorConfig,
      );
    }).toThrow();
  });

  it('should include custom code in error response', () => {
    const errorConfig: ErrorFormatConfig = {
      customMessage: 'Test error message',
      customCode: 'test_error_code',
    };

    try {
      service.handleCustomError(
        HttpStatus.BAD_REQUEST,
        'Test API',
        errorConfig,
      );
    } catch (error) {
      expect(error.getResponse()).toMatchObject({
        message: 'Test error message',
        status: HttpStatus.BAD_REQUEST,
        provider: 'Test API',
        code: 'test_error_code',
      });
    }
  });

  it('should not include code when customCode is not provided', () => {
    const errorConfig: ErrorFormatConfig = {
      customMessage: 'Test error message',
    };

    try {
      service.handleCustomError(
        HttpStatus.BAD_REQUEST,
        'Test API',
        errorConfig,
      );
    } catch (error) {
      const response = error.getResponse();
      expect(response.code).toBeUndefined();
      expect(response.message).toBe('Test error message');
    }
  });

  it('should include additional fields in error response', () => {
    const errorConfig: ErrorFormatConfig = {
      customMessage: 'Test error with additional fields',
      customCode: 'test_error_with_fields',
      additionalFields: {
        errorType: 'VALIDATION_ERROR',
        retryable: true,
        metadata: { userId: '123', action: 'create_store' },
      },
    };

    try {
      service.handleCustomError(
        HttpStatus.BAD_REQUEST,
        'Test API',
        errorConfig,
      );
    } catch (error) {
      const response = error.getResponse();
      expect(response).toMatchObject({
        message: 'Test error with additional fields',
        status: HttpStatus.BAD_REQUEST,
        provider: 'Test API',
        code: 'test_error_with_fields',
        errorType: 'VALIDATION_ERROR',
        retryable: true,
        metadata: { userId: '123', action: 'create_store' },
      });
    }
  });

  it('should not include additional fields when not provided', () => {
    const errorConfig: ErrorFormatConfig = {
      customMessage: 'Test error without additional fields',
      customCode: 'test_error_no_fields',
    };

    try {
      service.handleCustomError(
        HttpStatus.BAD_REQUEST,
        'Test API',
        errorConfig,
      );
    } catch (error) {
      const response = error.getResponse();
      expect(response.errorType).toBeUndefined();
      expect(response.retryable).toBeUndefined();
      expect(response.metadata).toBeUndefined();
      expect(response.message).toBe('Test error without additional fields');
      expect(response.code).toBe('test_error_no_fields');
    }
  });
});
