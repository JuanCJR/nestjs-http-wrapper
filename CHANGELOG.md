# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2024-07-26

### Added

- `HttpExceptionFilter` para estandarizar las respuestas de error en toda la aplicación.
- `ResponseInterceptor` para estandarizar las respuestas exitosas, envolviéndolas en un objeto `GenericResponse`.
- `GenericResponse` interface para definir la estructura de respuesta estándar.
- Exportación del filtro, interceptor e interfaz desde el punto de entrada principal del paquete.
- Sección en `README.md` explicando cómo registrar y usar el filtro e interceptor globalmente.

## [1.0.0] - 2024-07-26

### Added

- `HttpServiceWrapper` para simplificar y estandarizar las peticiones HTTP a servicios externos.
- `HttpErrorHelper` que convierte los errores de respuesta de la API en excepciones estándar de NestJS.
- `ErrorResponseDto` y `HttpRequestOptions` para un tipado fuerte de errores y opciones de petición.
- Configuración inicial del paquete, incluyendo `package.json` y `tsconfig.json`.
- Documentación inicial en `README.md` con instrucciones de instalación y uso básico.
