# NestJS HTTP Wrapper

[![NPM Version](https://img.shields.io/npm/v/nestjs-http-wrapper.svg)](https://www.npmjs.com/package/nestjs-http-wrapper)
[![License](https://img.shields.io/npm/l/nestjs-http-wrapper.svg)](https://opensource.org/licenses/ISC)

Un wrapper simple y robusto para el `HttpService` de NestJS que estandariza las peticiones HTTP y el manejo de errores.

## Descripción

Este paquete proporciona una clase `HttpServiceWrapper` que abstrae la lógica de realizar peticiones HTTP a servicios externos. Su principal objetivo es centralizar el manejo de errores, convirtiendo las respuestas de error HTTP en excepciones de NestJS (`HttpException`), lo que permite un manejo de errores consistente en toda tu aplicación.

## Características

- Wrapper sobre `HttpService` de `@nestjs/axios`.
- Manejo de errores centralizado que lanza excepciones estándar de NestJS.
- Tipado fuerte para peticiones y respuestas.
- **Nuevo en v1.2.0**: Soporte completo para todas las opciones de configuración de Axios.
- **Nuevo en v1.2.0**: Mayor flexibilidad en la configuración de peticiones HTTP.
- Fácil de integrar en cualquier proyecto NestJS.

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

Cuando una petición tiene éxito, el `ResponseInterceptor` la envolverá en la siguiente estructura:

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

## Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue o un pull request para discutir los cambios.

## Licencia

Este proyecto está licenciado bajo la [Licencia ISC](LICENSE).
