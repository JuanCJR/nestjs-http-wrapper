import { Injectable, HttpStatus } from '@nestjs/common';
import { HttpErrorHelper } from '../src/services/http-helper/httpHelper.util';
import { ErrorFormatConfig } from '../src/dto/http-helper.dto';
import { AxiosResponse } from 'axios';

/**
 * Example service that consumes a stores API
 * showing how to use handleCustomError to customize error messages and codes
 */
@Injectable()
export class StoreServiceExample {
  constructor(private readonly httpErrorHelper: HttpErrorHelper) {}

  /**
   * Searches for a store by ID
   * @param storeId - Store ID to search for
   */
  async getStoreById(storeId: string) {
    try {
      // Simulate HTTP call to stores API
      const response = await this.simulateHttpCall(`/api/stores/${storeId}`);

      // Normal validation (without custom configuration)
      return this.httpErrorHelper.validateResponse(response, 'Store API');
    } catch (error) {
      if (error.status === 404) {
        // Custom configuration for store 404 error
        const errorConfig: ErrorFormatConfig = {
          customMessage:
            'No encontramos esta tienda. Vuelve al inicio e intenta nuevamente.',
          customCode: 'store_not_found',
          additionalFields: {
            errorType: 'NOT_FOUND',
            retryable: false,
            suggestedAction: 'check_store_id',
          },
        };

        // Using handleCustomError method
        this.httpErrorHelper.handleCustomError(
          HttpStatus.NOT_FOUND,
          'Store API',
          errorConfig,
          { storeId, timestamp: new Date().toISOString() },
        );
      }
      throw error;
    }
  }

  /**
   * Searches for stores by category
   * @param category - Store category
   */
  async getStoresByCategory(category: string) {
    try {
      const response = await this.simulateHttpCall(
        `/api/stores?category=${category}`,
      );
      return this.httpErrorHelper.validateResponse(response, 'Store API');
    } catch (error) {
      if (error.status === 400) {
        const errorConfig: ErrorFormatConfig = {
          customMessage:
            'La categoría especificada no es válida. Por favor, selecciona una categoría de la lista.',
          customCode: 'invalid_category',
          additionalFields: {
            errorType: 'VALIDATION_ERROR',
            retryable: true,
            validCategories: ['electronics', 'clothing', 'books'],
          },
        };

        this.httpErrorHelper.handleCustomError(
          HttpStatus.BAD_REQUEST,
          'Store API',
          errorConfig,
          {
            category,
            availableCategories: ['electronics', 'clothing', 'books'],
          },
        );
      }
      throw error;
    }
  }

  /**
   * Simulates an HTTP call (replace with your real HTTP client)
   */
  private async simulateHttpCall(url: string): Promise<AxiosResponse<any>> {
    // Simulation of different responses based on URL
    if (url.includes('stores/999')) {
      const error = new Error('Not Found');
      (error as any).status = 404;
      (error as any).statusText = 'Not Found';
      throw error;
    }
    if (url.includes('category=invalid')) {
      const error = new Error('Bad Request');
      (error as any).status = 400;
      (error as any).statusText = 'Bad Request';
      throw error;
    }

    // Return a proper AxiosResponse-like object
    return {
      data: { id: '123', name: 'Tienda Ejemplo', category: 'electronics' },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as any,
    } as AxiosResponse<any>;
  }
}

/**
 * Example usage in a controller
 */
export class StoreControllerExample {
  constructor(private readonly storeService: StoreServiceExample) {}

  async getStore(req: any, res: any) {
    try {
      const store = await this.storeService.getStoreById(req.params.id);
      res.json({
        success: true,
        data: store,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      // Error is already formatted by HttpExceptionFilter
      // with custom message and code
      // Re-throw error to be handled by global filter
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Unknown error occurred');
    }
  }
}
