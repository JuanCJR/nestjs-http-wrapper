import { Test, TestingModule } from '@nestjs/testing';
import { CallHandler, ExecutionContext } from '@nestjs/common';
import { of } from 'rxjs';
import { ResponseInterceptor } from '../src/interceptors/response.interceptor';
import { GenericResponse } from '../src/interfaces/response.interface';

describe('ResponseInterceptor', () => {
  let interceptor: ResponseInterceptor<any>;
  let mockExecutionContext: ExecutionContext;
  let mockCallHandler: CallHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResponseInterceptor],
    }).compile();

    interceptor = module.get<ResponseInterceptor<any>>(ResponseInterceptor);

    mockExecutionContext = {} as ExecutionContext;
    mockCallHandler = {
      handle: jest.fn(),
    };

    // Mock Date
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-01-01T00:00:00.000Z'));
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  describe('intercept', () => {
    it('should wrap response data in GenericResponse format', (done) => {
      // Arrange
      const testData = { id: 1, name: 'test' };
      const expectedResponse: GenericResponse<typeof testData> = {
        data: testData,
        success: true,
        timestamp: '2024-01-01T00:00:00.000Z',
      };

      mockCallHandler.handle = jest.fn().mockReturnValue(of(testData));

      // Act
      const result$ = interceptor.intercept(
        mockExecutionContext,
        mockCallHandler,
      );

      // Assert
      result$.subscribe({
        next: (result) => {
          expect(result).toEqual(expectedResponse);
          expect(mockCallHandler.handle).toHaveBeenCalledTimes(1);
          done();
        },
        error: done,
      });
    });

    it('should handle null data', (done) => {
      // Arrange
      const testData = null;
      const expectedResponse: GenericResponse<null> = {
        data: null,
        success: true,
        timestamp: '2024-01-01T00:00:00.000Z',
      };

      mockCallHandler.handle = jest.fn().mockReturnValue(of(testData));

      // Act
      const result$ = interceptor.intercept(
        mockExecutionContext,
        mockCallHandler,
      );

      // Assert
      result$.subscribe({
        next: (result) => {
          expect(result).toEqual(expectedResponse);
          done();
        },
        error: done,
      });
    });

    it('should handle undefined data', (done) => {
      // Arrange
      const testData = undefined;
      const expectedResponse: GenericResponse<undefined> = {
        data: undefined,
        success: true,
        timestamp: '2024-01-01T00:00:00.000Z',
      };

      mockCallHandler.handle = jest.fn().mockReturnValue(of(testData));

      // Act
      const result$ = interceptor.intercept(
        mockExecutionContext,
        mockCallHandler,
      );

      // Assert
      result$.subscribe({
        next: (result) => {
          expect(result).toEqual(expectedResponse);
          done();
        },
        error: done,
      });
    });

    it('should handle array data', (done) => {
      // Arrange
      const testData = [{ id: 1 }, { id: 2 }];
      const expectedResponse: GenericResponse<typeof testData> = {
        data: testData,
        success: true,
        timestamp: '2024-01-01T00:00:00.000Z',
      };

      mockCallHandler.handle = jest.fn().mockReturnValue(of(testData));

      // Act
      const result$ = interceptor.intercept(
        mockExecutionContext,
        mockCallHandler,
      );

      // Assert
      result$.subscribe({
        next: (result) => {
          expect(result).toEqual(expectedResponse);
          done();
        },
        error: done,
      });
    });

    it('should handle string data', (done) => {
      // Arrange
      const testData = 'test string';
      const expectedResponse: GenericResponse<string> = {
        data: testData,
        success: true,
        timestamp: '2024-01-01T00:00:00.000Z',
      };

      mockCallHandler.handle = jest.fn().mockReturnValue(of(testData));

      // Act
      const result$ = interceptor.intercept(
        mockExecutionContext,
        mockCallHandler,
      );

      // Assert
      result$.subscribe({
        next: (result) => {
          expect(result).toEqual(expectedResponse);
          done();
        },
        error: done,
      });
    });

    it('should always set success to true', (done) => {
      // Arrange
      const testData = { someProperty: 'value' };
      mockCallHandler.handle = jest.fn().mockReturnValue(of(testData));

      // Act
      const result$ = interceptor.intercept(
        mockExecutionContext,
        mockCallHandler,
      );

      // Assert
      result$.subscribe({
        next: (result) => {
          expect(result.success).toBe(true);
          done();
        },
        error: done,
      });
    });

    it('should include current timestamp', (done) => {
      // Arrange
      const testData = { someProperty: 'value' };
      mockCallHandler.handle = jest.fn().mockReturnValue(of(testData));

      // Act
      const result$ = interceptor.intercept(
        mockExecutionContext,
        mockCallHandler,
      );

      // Assert
      result$.subscribe({
        next: (result) => {
          expect(result.timestamp).toBe('2024-01-01T00:00:00.000Z');
          expect(typeof result.timestamp).toBe('string');
          done();
        },
        error: done,
      });
    });
  });
});
