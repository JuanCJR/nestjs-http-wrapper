# Guía de Contribución

¡Gracias por tu interés en contribuir a `nestjs-http-wrapper`! Toda contribución es bienvenida. Para mantener el proyecto organizado y consistente, por favor sigue las siguientes guías.

## Flujo de Trabajo y Ramas (Git Flow)

Este proyecto utiliza un flujo de trabajo simple basado en Git Flow:

- `main`: Esta rama contiene el código de la última versión estable que ha sido publicada en npm. No se debe hacer push directamente a esta rama. Las actualizaciones llegan únicamente a través de Pull Requests desde ramas de `release`.

- `develop`: Esta es la rama principal de desarrollo. Contiene los últimos cambios y características que están listos para ser incluidos en la próxima versión. Todo el desarrollo nuevo debe partir de esta rama.

- `feature/<nombre-feature>`: Para desarrollar una nueva característica. Se crea a partir de `develop`. Ejemplo: `feature/add-retry-logic`.

- `fix/<nombre-fix>`: Para corregir un bug. Se crea a partir de `develop`. Ejemplo: `fix/handle-empty-responses`.

Una vez que una `feature` o `fix` está completa, se debe abrir un Pull Request para fusionarla a la rama `develop`.

## Control de Versiones Semántico (SemVer)

El versionado de este paquete sigue estrictamente las reglas de **Versionado Semántico 2.0.0** ([https://semver.org/](https://semver.org/)).

Dado un número de versión `MAJOR.MINOR.PATCH`:

1.  **`MAJOR` (ej. `2.0.0`):** Se incrementa cuando se introducen cambios incompatibles con la versión anterior (breaking changes).
2.  **`MINOR` (ej. `1.2.0`):** Se incrementa cuando se añaden nuevas funcionalidades de una manera que es retrocompatible.
3.  **`PATCH` (ej. `1.1.1`):** Se incrementa cuando se hacen correcciones de bugs o mejoras internas que son retrocompatibles (como refactorizaciones, añadir tests, etc.).

## Proceso para Crear una Nueva Versión (Release)

1.  **Asegurar que `develop` está al día:** Todos los cambios para la nueva versión deben estar ya fusionados en la rama `develop`.

2.  **Actualizar la Versión:**
    - Basado en los cambios acumulados en `develop`, decide si la nueva versión es `MAJOR`, `MINOR`, o `PATCH`.
    - Actualiza el campo `"version"` en el archivo `package.json`.

3.  **Actualizar el `CHANGELOG.md`:**
    - Añade una nueva entrada en la parte superior del archivo para la nueva versión.
    - Sigue el formato de "Keep a Changelog" ([https://keepachangelog.com/](https://keepachangelog.com/)).
    - Mueve la entrada `[Unreleased]` a la nueva versión y añade la fecha.
    - Resume los cambios en las secciones `Added`, `Changed`, `Fixed`, `Removed`, etc.

4.  **Crear Pull Request a `main`:**
    - Crea una rama de `release` desde `develop` (ej. `release/v1.2.0`). Aunque para cambios pequeños, puedes hacer el PR directamente desde `develop`.
    - Haz un commit con los cambios de versión: `git commit -m "chore(release): version v1.2.0"`.
    - Abre un Pull Request desde tu rama de `release` (o `develop`) hacia la rama `main`.

5.  **Fusionar y Etiquetar (Tag):**
    - Una vez que el PR es aprobado y fusionado en `main`, asegúrate de estar en la rama `main` y que tienes los últimos cambios (`git pull origin main`).
    - Crea una etiqueta de Git con el número de la versión:
      ```bash
      git tag -a v1.2.0 -m "Release version 1.2.0"
      ```
    - Sube la etiqueta al repositorio remoto:
      ```bash
      git push --tags
      ```

6.  **Publicar en NPM:**
    - Desde la rama `main`, ejecuta el comando para publicar el paquete:
      ```bash
      npm publish
      ```

7.  **Sincronizar `develop`:**
    - Finalmente, fusiona `main` de vuelta a `develop` para que la rama de desarrollo también tenga el último número de versión.
      ```bash
      git checkout develop
      git merge main
      git push origin develop
      ```

¡Y eso es todo! Siguiendo estos pasos aseguramos un ciclo de vida de desarrollo limpio y predecible.
