# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.5.0] - 2025-04-11

### Changed

- **ResponseInterceptor**: El comportamiento por defecto ahora no incluye los campos `success` y `timestamp` en la respuesta. Estos campos ahora son opcionales y se controlan mediante las opciones del constructor.
- **ResponseInterceptorOptions**: Nueva interfaz para configurar el comportamiento del interceptor, permitiendo activar `includeSuccess` e `includeTimestamp` según sea necesario.

### Enhanced

- **ResponseInterceptor**: Ahora acepta opciones opcionales en el constructor (`ResponseInterceptorOptions`) para controlar qué campos adicionales se incluyen en la respuesta.
- **Flexibilidad de Respuesta**: Permite respuestas más ligeras cuando no se necesitan los campos `success` y `timestamp`, mejorando el control sobre la estructura de respuesta.

### Testing

- **Tests Actualizados**: Se actualizaron todos los tests unitarios del `ResponseInterceptor` para reflejar el nuevo comportamiento opcional de los campos `success` y `timestamp`.
- **Cobertura Completa**: Se agregaron tests para todos los escenarios: comportamiento por defecto, solo `includeSuccess`, solo `includeTimestamp`, y ambos habilitados.

## [1.4.1] - 2025-01-14

### Fixed

- **Error Response Fields**: Fixed issue where `additionalFields` and `customCode` from `ErrorFormatConfig` were not being included in the final error response.
- **HttpExceptionFilter**: Enhanced error response processing to properly extract and include custom fields from `ErrorResponseDto`.

### Enhanced

- **GenericError Interface**: Added optional fields `provider`, `code`, and `additionalFields` to support custom error metadata.
- **ErrorResponseDto**: Added support for dynamic properties to accommodate additional fields from `ErrorFormatConfig`.
- **Error Response Structure**: Improved error response structure to include all custom fields in the final API response.

### Added

- **Comprehensive Testing**: Added test case to verify that additional fields and custom codes are properly included in error responses.
- **Example Documentation**: Created practical example showing how to use custom error fields in real-world scenarios.

## [1.3.0] - 2025-09-14

### Added

- **Custom Error Handling**: New `handleCustomError` method in `HttpErrorHelper` for customizable error responses.
- **Error Format Configuration**: New `ErrorFormatConfig` interface allowing customization of error messages, codes, and additional fields.
- **Custom Error Codes**: Support for custom error codes in `ErrorResponseDto` via the new `code` field.
- **Additional Fields Support**: Ability to include custom metadata in error responses through `additionalFields`.
- **Comprehensive Examples**: Complete example implementation showing how to use custom error handling in real-world scenarios.
- **Enhanced Testing**: 7 new test cases covering all custom error handling functionality.

### Enhanced

- **ErrorResponseDto**: Added optional `code` field for custom error identification.
- **HttpErrorHelper**: Extended with `handleCustomError` method for advanced error customization.
- **Type Safety**: Improved TypeScript support with proper typing for all new features.

### Documentation

- **Updated README**: Added comprehensive documentation for custom error handling features.
- **Code Examples**: Included practical examples demonstrating custom error configuration.
- **API Documentation**: Enhanced API documentation with new method signatures and interfaces.

## [1.2.0] - 2024-12-19

### Changed

- **BREAKING CHANGE**: Refactorización del tipo `HttpRequestOptions` para extender `AxiosRequestConfig` en lugar de usar un tipo personalizado limitado.
- El `HttpServiceWrapper` ahora acepta todas las opciones de configuración disponibles en Axios, proporcionando mayor flexibilidad para configurar peticiones HTTP.
- Simplificación del método `request` al eliminar la configuración manual de headers y usar directamente las opciones de Axios.

### Added

- Soporte completo para todas las opciones de configuración de Axios en las peticiones HTTP.
- Mejor integración con el ecosistema de Axios para configuraciones avanzadas.

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
