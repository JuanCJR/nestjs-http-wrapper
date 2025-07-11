import { plainToInstance } from 'class-transformer';
import { ErrorResponseDto } from './http-helper.dto';

describe('ErrorResponseDto', () => {
  it('should be defined', () => {
    const dto = new ErrorResponseDto();
    expect(dto).toBeDefined();
  });

  it('should create an instance with all required properties', () => {
    const errorData = {
      message: 'Test error message',
      status: 400,
      provider: 'TestProvider',
      response: { detail: 'Additional error info' },
    };

    const dto = plainToInstance(ErrorResponseDto, errorData);

    expect(dto.message).toBe('Test error message');
    expect(dto.status).toBe(400);
    expect(dto.provider).toBe('TestProvider');
    expect(dto.response).toEqual({ detail: 'Additional error info' });
  });

  it('should create an instance without optional response property', () => {
    const errorData = {
      message: 'Test error message',
      status: 404,
      provider: 'TestProvider',
    };

    const dto = plainToInstance(ErrorResponseDto, errorData);

    expect(dto.message).toBe('Test error message');
    expect(dto.status).toBe(404);
    expect(dto.provider).toBe('TestProvider');
    expect(dto.response).toBeUndefined();
  });

  it('should handle null response property', () => {
    const errorData = {
      message: 'Internal Server Error',
      status: 500,
      provider: 'ExternalAPI',
      response: null,
    };

    const dto = plainToInstance(ErrorResponseDto, errorData);

    expect(dto.message).toBe('Internal Server Error');
    expect(dto.status).toBe(500);
    expect(dto.provider).toBe('ExternalAPI');
    expect(dto.response).toBeNull();
  });

  it('should handle different data types for response property', () => {
    const errorDataWithString = {
      message: 'Error',
      status: 400,
      provider: 'API',
      response: 'String response',
    };

    const dtoWithString = plainToInstance(
      ErrorResponseDto,
      errorDataWithString,
    );
    expect(dtoWithString.response).toBe('String response');

    const errorDataWithNumber = {
      message: 'Error',
      status: 400,
      provider: 'API',
      response: 12345,
    };

    const dtoWithNumber = plainToInstance(
      ErrorResponseDto,
      errorDataWithNumber,
    );
    expect(dtoWithNumber.response).toBe(12345);

    const errorDataWithArray = {
      message: 'Error',
      status: 400,
      provider: 'API',
      response: ['error1', 'error2'],
    };

    const dtoWithArray = plainToInstance(ErrorResponseDto, errorDataWithArray);
    expect(dtoWithArray.response).toEqual(['error1', 'error2']);
  });

  it('should transform plain object to DTO instance correctly', () => {
    const errorData = {
      message: 'Validation Error',
      status: 422,
      provider: 'ValidationAPI',
      response: { field: 'Invalid value' },
    };

    const dto = plainToInstance(ErrorResponseDto, errorData);

    expect(dto).toBeInstanceOf(ErrorResponseDto);
    expect(dto.message).toBe('Validation Error');
    expect(dto.status).toBe(422);
    expect(dto.provider).toBe('ValidationAPI');
    expect(dto.response).toEqual({ field: 'Invalid value' });
  });

  it('should maintain property types', () => {
    const errorData = {
      message: 'Type test',
      status: 400,
      provider: 'TypeAPI',
      response: { nested: { value: true } },
    };

    const dto = plainToInstance(ErrorResponseDto, errorData);

    expect(typeof dto.message).toBe('string');
    expect(typeof dto.status).toBe('number');
    expect(typeof dto.provider).toBe('string');
    expect(typeof dto.response).toBe('object');
    expect(dto.response.nested.value).toBe(true);
  });

  it('should handle undefined values correctly', () => {
    const errorData = {
      message: undefined as any,
      status: undefined as any,
      provider: undefined as any,
      response: undefined,
    };

    const dto = plainToInstance(ErrorResponseDto, errorData);

    expect(dto.message).toBeUndefined();
    expect(dto.status).toBeUndefined();
    expect(dto.provider).toBeUndefined();
    expect(dto.response).toBeUndefined();
  });

  it('should preserve all properties when serializing to JSON', () => {
    const errorData = {
      message: 'JSON test',
      status: 500,
      provider: 'JSONAPI',
      response: { serialization: 'test' },
    };

    const dto = plainToInstance(ErrorResponseDto, errorData);
    const jsonString = JSON.stringify(dto);
    const parsedObject = JSON.parse(jsonString);

    expect(parsedObject.message).toBe('JSON test');
    expect(parsedObject.status).toBe(500);
    expect(parsedObject.provider).toBe('JSONAPI');
    expect(parsedObject.response).toEqual({ serialization: 'test' });
  });
});
