# NestJS HTTP Wrapper

[![NPM Version](https://img.shields.io/npm/v/nestjs-http-wrapper.svg)](https://www.npmjs.com/package/nestjs-http-wrapper)
[![License](https://img.shields.io/npm/l/nestjs-http-wrapper.svg)](https://opensource.org/licenses/ISC)
[![Tests](https://img.shields.io/badge/tests-76%20passed-brightgreen.svg)](https://github.com/JuanCJR/nestjs-http-wrapper)
[![Coverage](https://img.shields.io/badge/coverage-100%25%20statements%20%7C%2093.5%25%20branches-brightgreen.svg)](https://github.com/JuanCJR/nestjs-http-wrapper)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)

Un wrapper simple y robusto para el `HttpService` de NestJS que estandariza las peticiones HTTP y el manejo de errores.

## Descripción

Este paquete proporciona una clase `HttpServiceWrapper` que abstrae la lógica de realizar peticiones HTTP a servicios externos. Su principal objetivo es centralizar el manejo de errores, convirtiendo las respuestas de error HTTP en excepciones de NestJS (`HttpException`), lo que permite un manejo de errores consistente en toda tu aplicación.

## Características

- Wrapper sobre `HttpService` de `@nestjs/axios`.
- Manejo de errores centralizado que lanza excepciones estándar de NestJS.
- Tipado fuerte para peticiones y respuestas.
- **Nuevo en v1.2.0**: Soporte completo para todas las opciones de configuración de Axios.
- **Nuevo en v1.2.0**: Mayor flexibilidad en la configuración de peticiones HTTP.
- **Nuevo en v1.3.0**: Manejo personalizado de errores con mensajes y códigos personalizados.
- **Nuevo en v1.3.0**: Configuración flexible del formato de respuestas de error.
- **Nuevo en v1.3.0**: Soporte para campos adicionales en respuestas de error.
- **Corregido en v1.4.1**: Los campos `additionalFields` y `customCode` ahora se incluyen correctamente en la respuesta final del filtro de excepciones.
- **Nuevo en v1.5.0**: `ResponseInterceptor` ahora permite configurar opcionalmente los campos `success` y `timestamp` mediante opciones del constructor.
- Fácil de integrar en cualquier proyecto NestJS.

## Cobertura de Tests

Este proyecto mantiene una alta cobertura de tests para garantizar la calidad y confiabilidad del código:

| Métrica        | Cobertura | Estado |
| -------------- | --------- | ------ |
| **Statements** | 100%      | ✅     |
| **Branches**   | 88.37%    | ✅     |
| **Functions**  | 100%      | ✅     |
| **Lines**      | 100%      | ✅     |

### Detalles por Módulo

| Módulo                            | Statements | Branches | Functions | Lines |
| --------------------------------- | ---------- | -------- | --------- | ----- |
| **filters**                       | 100%       | 81.48%   | 100%      | 100%  |
| **interceptors**                  | 100%       | 100%     | 100%      | 100%  |
| **services/http-helper**          | 100%       | 100%     | 100%      | 100%  |
| **services/http-service-wrapper** | 100%       | 100%     | 100%      | 100%  |

### Ejecutar Tests

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests con cobertura (texto)
npm run test:coverage

# Ejecutar tests con cobertura HTML (abre en navegador)
npm run test:coverage:html

# Ejecutar tests con cobertura LCOV (para CI/CD)
npm run test:coverage:lcov

# Ejecutar tests en modo watch
npm run test:watch

# Ejecutar tests específicos
npm test -- --testPathPattern=http-helper

# Ejecutar tests en modo debug
npm run test:debug
```

## Instalación

```bash
npm install nestjs-http-wrapper
```

o si usas yarn:

```bash
yarn add nestjs-http-wrapper
```

**Dependencias Peer**

Asegúrate de tener las siguientes dependencias instaladas en tu proyecto:

- `@nestjs/common`
- `@nestjs/axios`
- `axios`
- `rxjs`

## Cómo Usarlo

### 1. Importar el Módulo

Primero, importa `HttpUtilsModule` en el módulo de tu aplicación donde quieras usarlo (por ejemplo, `app.module.ts`).

```typescript
// en app.module.ts
import { Module } from '@nestjs/common';
import { HttpUtilsModule } from 'nestjs-http-wrapper';

@Module({
  imports: [
    HttpUtilsModule,
    // ... otros módulos
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
```

### 2. Inyectar y Usar el Servicio

Ahora puedes inyectar `HttpServiceWrapper` en cualquier servicio o controlador. El wrapper se encarga de lanzar excepciones de NestJS (`HttpException`) automáticamente cuando la API externa devuelve un error, lo que permite un código más limpio y el uso de `ExceptionFilters` globales.

```typescript
// en tu-servicio.service.ts
import { Injectable } from '@nestjs/common';
import { HttpServiceWrapper } from 'nestjs-http-wrapper';

interface User {
  id: number;
  name: string;
}

@Injectable()
export class MiServicio {
  constructor(private readonly http: HttpServiceWrapper) {}

  async obtenerUsuario(id: number): Promise<User> {
    // No es necesario un bloque try/catch.
    // Si la API externa devuelve un error (ej: 404 Not Found), el wrapper
    // lanzará automáticamente una NotFoundException. Esta excepción puede ser
    // manejada de forma centralizada por un ExceptionFilter de NestJS.

    const user = await this.http.request<User>({
      method: 'get',
      url: `https://api.ejemplo.com/users/${id}`,
      provider: 'API-Ejemplo', // Identificador para logs y trazabilidad
    });

    return user;
  }

  async obtenerUsuarioConTimeout(id: number): Promise<User> {
    const user = await this.http.request<User>({
      method: 'get',
      url: `https://api.ejemplo.com/users/${id}`,
      provider: 'API-Ejemplo',
      timeout: 5000, // 5 segundos de timeout
      headers: {
        Authorization: 'Bearer token123',
        Accept: 'application/json',
      },
    });

    return user;
  }

  async crearUsuarioConConfiguracionAvanzada(
    userData: Partial<User>,
  ): Promise<User> {
    const user = await this.http.request<User, Partial<User>>({
      method: 'post',
      url: 'https://api.ejemplo.com/users',
      provider: 'API-Ejemplo',
      data: userData,
      timeout: 10000,
      maxRedirects: 3,
      withCredentials: true,
      responseType: 'json',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': 'your-api-key',
      },
    });

    return user;
  }
}
```

## Estandarización de Respuestas con Interceptor y Filtro

Este paquete también incluye un `ResponseInterceptor` y un `HttpExceptionFilter` para estandarizar todas las respuestas de tu API (tanto las exitosas como las erróneas).

### Cómo usarlos

Para habilitarlos de forma global en tu aplicación, regístralos en tu archivo `main.ts`.

```typescript
// en main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter, ResponseInterceptor } from 'nestjs-http-wrapper';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Registra el interceptor para estandarizar respuestas exitosas
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Registra el filtro para estandarizar respuestas de error
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(3000);
}
bootstrap();
```

### Formato de Respuesta Exitosa

Cuando una petición tiene éxito, el `ResponseInterceptor` la envolverá en una estructura `GenericResponse`. El formato depende de las opciones configuradas:

#### Comportamiento por Defecto (v1.5.0+)

Por defecto, solo se incluye el campo `data`:

```json
{
  "data": {
    "id": 1,
    "name": "Leanne Graham"
  }
}
```

#### Con Opciones Configuradas

Si se configuran las opciones `includeSuccess` y/o `includeTimestamp`, se incluyen esos campos:

```json
{
  "data": {
    "id": 1,
    "name": "Leanne Graham"
  },
  "success": true,
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

#### Configuración del ResponseInterceptor

```typescript
// Solo incluir 'success'
new ResponseInterceptor({ includeSuccess: true });

// Solo incluir 'timestamp'
new ResponseInterceptor({ includeTimestamp: true });

// Incluir ambos
new ResponseInterceptor({
  includeSuccess: true,
  includeTimestamp: true,
});
```

### Formato de Respuesta de Error

Cuando se lanza una `HttpException` (ya sea desde tu código o desde el `HttpServiceWrapper`), el `HttpExceptionFilter` la capturará y devolverá una respuesta estandarizada:

```json
{
  "data": null,
  "error": {
    "status": 404,
    "message": ["Cannot GET /users/999"],
    "error": "Not Found",
    "statusCode": 404,
    "timestamp": "2024-01-01T12:00:00.000Z",
    "path": "/users/999",
    "method": "GET"
  },
  "success": false,
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

#### Respuesta de Error con Campos Personalizados (v1.4.1+)

Cuando se usan errores personalizados con `ErrorFormatConfig`, la respuesta incluirá los campos adicionales:

```json
{
  "data": null,
  "error": {
    "status": 404,
    "message": [
      "No encontramos esta tienda. Vuelve al inicio e intenta nuevamente."
    ],
    "error": "API Error from hub-bff",
    "statusCode": 404,
    "timestamp": "2025-09-14T16:18:31.955Z",
    "path": "/api/scan-go-bff/v1/cart/add",
    "method": "POST",
    "provider": "hub-bff",
    "code": "store_not_found",
    "additionalFields": {
      "facilityId": "3661",
      "country": "CL",
      "xCommerce": "ecommerce"
    }
  },
  "success": false,
  "timestamp": "2025-09-14T16:18:31.955Z"
}
```

## API

### `HttpServiceWrapper`

El servicio principal que debes usar.

#### `request<TResponse, TRequest = unknown>(options: HttpRequestOptions<TRequest>): Promise<TResponse>`

Este método realiza una petición HTTP.

- **`TResponse`**: El tipo esperado para la data de la respuesta exitosa.
- **`TRequest`**: El tipo del cuerpo de la petición (para métodos `post`, `put`, etc.).
- **`options`**: Un objeto de tipo `HttpRequestOptions`.

#### `HttpRequestOptions`

El tipo `HttpRequestOptions` extiende `AxiosRequestConfig` de Axios, lo que significa que acepta todas las opciones de configuración disponibles en Axios. Esto proporciona máxima flexibilidad para configurar tus peticiones HTTP.

**Propiedades requeridas:**
| Propiedad | Tipo | Descripción |
| :--------- | :------- | :---------------------------------------------------------------- |
| `url` | `string` | La URL del endpoint. |
| `provider` | `string` | Un nombre identificador del servicio externo para logs y errores. |

**Propiedades opcionales principales:**
| Propiedad | Tipo | Descripción |
| :--------- | :------------------------------------- | :---------------------------------------------------------------- |
| `method` | `'get' \| 'post' \| 'put' \| 'delete' \| 'patch' \| 'head' \| 'options'` | El método HTTP para la petición. |
| `data` | `TRequest` | El cuerpo de la petición (payload). |
| `headers` | `Record<string, string>` | Cabeceras HTTP adicionales. |
| `params` | `Record<string, unknown>` | Parámetros de consulta (query params) para la URL. |
| `timeout` | `number` | Tiempo de espera en milisegundos. |
| `baseURL` | `string` | URL base para todas las peticiones. |
| `auth` | `{username: string, password: string}` | Credenciales de autenticación básica. |
| `responseType` | `'json' \| 'text' \| 'blob' \| 'arraybuffer'` | Tipo de respuesta esperada. |

**Nota:** Al extender `AxiosRequestConfig`, también tienes acceso a todas las demás opciones de configuración de Axios como `proxy`, `maxRedirects`, `withCredentials`, etc.

### `HttpErrorHelper`

El servicio `HttpErrorHelper` proporciona utilidades para el manejo de errores HTTP.

#### `handleCustomError(statusCode: HttpStatus, provider: string, errorConfig: ErrorFormatConfig, originalData?: any): never`

Método para manejar errores con configuración personalizada.

- **`statusCode`**: Código de estado HTTP del error.
- **`provider`**: Nombre del proveedor de la API para identificación en logs.
- **`errorConfig`**: Configuración personalizada del error (mensaje, código, campos adicionales).
- **`originalData`**: Datos originales de la respuesta (opcional).

#### `ErrorFormatConfig`

```typescript
interface ErrorFormatConfig {
  customMessage?: string; // Mensaje personalizado de error
  customCode?: string; // Código de error personalizado
  additionalFields?: Record<string, any>; // Campos adicionales personalizados
}
```

## Configuraciones Avanzadas

Con la nueva implementación que extiende `AxiosRequestConfig`, puedes aprovechar todas las capacidades de Axios:

### Timeouts y Reintentos

```typescript
const response = await this.http.request<Data>({
  method: 'get',
  url: 'https://api.ejemplo.com/data',
  provider: 'API-Ejemplo',
  timeout: 10000, // 10 segundos
  maxRedirects: 5,
  retry: 3, // Si tu configuración de Axios lo soporta
});
```

### Autenticación

```typescript
// Autenticación básica
const response = await this.http.request<Data>({
  method: 'get',
  url: 'https://api.ejemplo.com/protected',
  provider: 'API-Ejemplo',
  auth: {
    username: 'user',
    password: 'pass',
  },
});

// Con token Bearer
const response = await this.http.request<Data>({
  method: 'get',
  url: 'https://api.ejemplo.com/protected',
  provider: 'API-Ejemplo',
  headers: {
    Authorization: 'Bearer your-token-here',
  },
});
```

### Configuración de Proxy

```typescript
const response = await this.http.request<Data>({
  method: 'get',
  url: 'https://api.ejemplo.com/data',
  provider: 'API-Ejemplo',
  proxy: {
    host: 'proxy.example.com',
    port: 8080,
    auth: {
      username: 'proxyuser',
      password: 'proxypass',
    },
  },
});
```

### Configuración de SSL/TLS

```typescript
const response = await this.http.request<Data>({
  method: 'get',
  url: 'https://api.ejemplo.com/data',
  provider: 'API-Ejemplo',
  httpsAgent: new https.Agent({
    rejectUnauthorized: false, // Solo para desarrollo
  }),
});
```

## Manejo de Errores

Si la respuesta de la API tiene un código de estado que no es `200 OK` o `201 Created`, `HttpServiceWrapper` lanzará automáticamente una excepción de NestJS apropiada (ej: `NotFoundException`, `BadRequestException`, `InternalServerErrorException`, etc.).

El cuerpo de la excepción será un objeto `ErrorResponseDto`:

```typescript
export class ErrorResponseDto {
  message: string; // El `statusText` del error.
  status: number; // El código de estado HTTP.
  provider: string; // El nombre del proveedor que especificaste.
  response?: any; // El cuerpo original de la respuesta de error de la API.
}
```

Esto te permite usar los filtros de excepciones de NestJS (`ExceptionFilter`) para capturar y formatear las respuestas de error de manera global y consistente.

## Manejo Personalizado de Errores (v1.3.0)

### Configuración de Errores Personalizados

A partir de la versión 1.3.0, puedes personalizar completamente el formato de las respuestas de error usando el método `handleCustomError` del `HttpErrorHelper`.

#### Interfaz ErrorFormatConfig

```typescript
interface ErrorFormatConfig {
  customMessage?: string; // Mensaje personalizado de error
  customCode?: string; // Código de error personalizado
  additionalFields?: Record<string, any>; // Campos adicionales
}
```

#### Ejemplo de Uso

```typescript
import { Injectable, HttpStatus } from '@nestjs/common';
import { HttpErrorHelper } from 'nestjs-http-wrapper';
import { ErrorFormatConfig } from 'nestjs-http-wrapper';

@Injectable()
export class StoreService {
  constructor(private readonly httpErrorHelper: HttpErrorHelper) {}

  async getStoreById(storeId: string) {
    try {
      // Tu lógica de negocio aquí
      const response = await this.httpClient.get(`/api/stores/${storeId}`);
      return response.data;
    } catch (error) {
      if (error.status === 404) {
        // Configuración personalizada para error 404
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
}
```

#### Respuesta de Error Personalizada

Con la configuración anterior, la respuesta de error será:

```json
{
  "data": null,
  "error": {
    "status": 404,
    "message": [
      "No encontramos esta tienda. Vuelve al inicio e intenta nuevamente."
    ],
    "error": "API Error from Store API",
    "statusCode": 404,
    "timestamp": "2024-01-15T10:30:00.000Z",
    "path": "/api/stores/123",
    "method": "GET",
    "provider": "Store API",
    "code": "store_not_found",
    "additionalFields": {
      "errorType": "NOT_FOUND",
      "retryable": false,
      "suggestedAction": "check_store_id"
    }
  },
  "success": false,
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Nota importante (v1.4.1+)**: Los campos personalizados definidos en `additionalFields` ahora se agrupan correctamente en el objeto `additionalFields` de la respuesta final, mientras que `customCode` se incluye directamente como `code`.

#### Casos de Uso Comunes

**1. Errores de Validación con Códigos Específicos**

```typescript
const errorConfig: ErrorFormatConfig = {
  customMessage: 'La categoría especificada no es válida.',
  customCode: 'invalid_category',
  additionalFields: {
    errorType: 'VALIDATION_ERROR',
    retryable: true,
    validCategories: ['electronics', 'clothing', 'books'],
  },
};
```

**2. Errores de Autenticación con Información de Seguridad**

```typescript
const errorConfig: ErrorFormatConfig = {
  customMessage:
    'Token de acceso expirado. Por favor, inicia sesión nuevamente.',
  customCode: 'token_expired',
  additionalFields: {
    errorType: 'AUTHENTICATION_ERROR',
    retryable: false,
    requiresReauth: true,
    expiresAt: '2024-01-15T12:00:00.000Z',
  },
};
```

**3. Errores de Límite de Rate con Información de Reintento**

```typescript
const errorConfig: ErrorFormatConfig = {
  customMessage:
    'Has excedido el límite de peticiones. Intenta nuevamente en unos minutos.',
  customCode: 'rate_limit_exceeded',
  additionalFields: {
    errorType: 'RATE_LIMIT_ERROR',
    retryable: true,
    retryAfter: 300, // segundos
    currentLimit: 100,
    resetTime: '2024-01-15T12:05:00.000Z',
  },
};
```

### Ventajas del Manejo Personalizado

- **Mensajes de Usuario**: Proporciona mensajes de error más amigables y específicos para el contexto de tu aplicación.
- **Códigos de Error**: Permite identificar errores específicos de manera programática.
- **Metadatos Adicionales**: Incluye información contextual que puede ser útil para debugging o para la lógica del frontend.
- **Consistencia**: Mantiene un formato estándar mientras permite personalización.
- **Backward Compatible**: No afecta el comportamiento existente del código.

## Estado del Proyecto

### Calidad del Código

- ✅ **76 tests** pasando exitosamente
- ✅ **100% cobertura** de statements, functions y lines
- ✅ **93.5% cobertura** de branches
- ✅ **TypeScript** con tipado estricto
- ✅ **ESLint** configurado para mantener estándares de código
- ✅ **Jest** para testing unitario
- ✅ **Semantic Versioning** para versionado

### CI/CD

Este proyecto utiliza GitHub Actions para:

- Ejecutar tests automáticamente en cada push
- Verificar cobertura de código
- Validar linting y formato
- Publicar automáticamente en NPM

### Métricas de Calidad

| Métrica              | Valor    | Objetivo |
| -------------------- | -------- | -------- |
| Tests                | 76/76 ✅ | 100%     |
| Cobertura Statements | 100%     | ≥80%     |
| Cobertura Branches   | 93.5%    | ≥70%     |
| Cobertura Functions  | 100%     | ≥80%     |
| Cobertura Lines      | 100%     | ≥80%     |

## Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue o un pull request para discutir los cambios.

### Guías para Contribuir

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'feat: agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

### Estándares de Código

- Sigue las convenciones de TypeScript
- Mantén la cobertura de tests por encima del 80%
- Asegúrate de que todos los tests pasen
- Actualiza la documentación cuando sea necesario

## Licencia

Este proyecto está licenciado bajo la [Licencia ISC](LICENSE).
