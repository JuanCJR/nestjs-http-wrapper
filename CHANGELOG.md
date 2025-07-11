# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.2] - 2024-07-26

### Changed

- Actualiazcion del `package.json` para incluir los campos `git`, `bugs` y `author`.

## [1.1.1] - 2024-07-26

### Changed

- Refactorización de la estructura del proyecto para separar completamente el código fuente (`src/`) del código de pruebas (`test/`).
- Limpieza de todos los archivos de especificaciones (`.spec.ts`) del directorio `src/`.

### Added

- Pruebas unitarias para todos los componentes principales: `HttpServiceWrapper`, `HttpErrorHelper`, `HttpExceptionFilter` y `ResponseInterceptor`.
- Configuración de Jest (`jest.config.ts`) para la ejecución de pruebas y el reporte de cobertura de código.

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
