import { HttpErrorHelper } from '../src/services/http-helper/httpHelper.util';
import { HttpStatus } from '@nestjs/common';

/**
 * Ejemplo de uso del HttpErrorHelper con campos adicionales
 */
export class ErrorWithAdditionalFieldsExample {
  private httpErrorHelper = new HttpErrorHelper();

  /**
   * Ejemplo de error con campos adicionales
   */
  handleStoreNotFoundError() {
    const errorConfig = {
      customMessage:
        'No encontramos esta tienda. Vuelve al inicio e intenta nuevamente.',
      customCode: 'store_not_found',
      additionalFields: {
        facilityId: '3661',
        country: 'CL',
        xCommerce: 'falabella',
      },
    };

    // Este método lanzará una excepción con los campos adicionales
    this.httpErrorHelper.handleCustomError(
      HttpStatus.NOT_FOUND,
      'hub-bff',
      errorConfig,
      { storeId: '123' },
    );
  }

  /**
   * Ejemplo de error con diferentes campos adicionales
   */
  handleValidationError() {
    const errorConfig = {
      customMessage: 'Los datos proporcionados no son válidos',
      customCode: 'validation_error',
      additionalFields: {
        field: 'email',
        value: 'invalid-email',
        constraints: ['isEmail', 'isNotEmpty'],
      },
    };

    this.httpErrorHelper.handleCustomError(
      HttpStatus.BAD_REQUEST,
      'validation-service',
      errorConfig,
    );
  }
}

/**
 * Respuesta esperada del filtro de excepciones:
 *
 * {
 *   "data": null,
 *   "error": {
 *     "status": 404,
 *     "message": [
 *       "No encontramos esta tienda. Vuelve al inicio e intenta nuevamente."
 *     ],
 *     "error": "API Error from hub-bff",
 *     "statusCode": 404,
 *     "timestamp": "2025-09-14T16:18:31.955Z",
 *     "path": "/api/scan-go-bff/v1/cart/add",
 *     "method": "POST",
 *     "provider": "hub-bff",
 *     "code": "store_not_found",
 *     "additionalFields": {
 *       "facilityId": "3661",
 *       "country": "CL",
 *       "xCommerce": "falabella"
 *     }
 *   },
 *   "success": false,
 *   "timestamp": "2025-09-14T16:18:31.955Z"
 * }
 */
