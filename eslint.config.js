const js = require('@eslint/js');
const tsParser = require('@typescript-eslint/parser');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const prettierPlugin = require('eslint-plugin-prettier');
const prettierConfig = require('eslint-config-prettier');

module.exports = [
  js.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: ['./tsconfig.json', './test/tsconfig.json'],
        tsconfigRootDir: __dirname,
        sourceType: 'module',
      },
      globals: {
        process: 'readonly',
        __dirname: 'readonly',
        console: 'readonly',
        Buffer: 'readonly',
        global: 'readonly',
        // Jest globals
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        jest: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      ...tsPlugin.configs['recommended-requiring-type-checking'].rules,
      ...prettierConfig.rules,

      // TypeScript specific rules
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'warn',
      '@typescript-eslint/explicit-module-boundary-types': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/prefer-optional-chain': 'error',

      // Deshabilitar reglas problemáticas para DTOs y clases de respuesta
      '@typescript-eslint/no-inferrable-types': 'off',
      '@typescript-eslint/no-empty-interface': 'off',

      // NestJS specific rules
      '@typescript-eslint/no-empty-function': [
        'error',
        { allow: ['constructors'] },
      ],

      // General code quality
      'no-console': 'warn',
      'prefer-const': 'error',
      'no-var': 'error',
      'object-shorthand': 'error',
      'prefer-template': 'error',

      // Import organization
      'sort-imports': ['error', { ignoreDeclarationSort: true }],

      // Prettier
      'prettier/prettier': 'error',
    },
  },
  // Configuración específica para archivos de interfaces y DTOs
  {
    files: [
      '**/interfaces/**/*.ts',
      '**/dto/**/*.ts',
      '**/dtos/**/*.ts',
      '**/*.interface.ts',
      '**/*.dto.ts',
      '**/entities/**/*.ts',
      '**/*.entity.ts',
      '**/models/**/*.ts',
      '**/*.model.ts',
    ],
    rules: {
      // Deshabilitar reglas de inicialización para DTOs e interfaces
      '@typescript-eslint/no-inferrable-types': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      // Permitir propiedades no inicializadas en DTOs (son para Swagger)
      '@typescript-eslint/no-non-null-assertion': 'off',
      // Permitir interfaces y clases vacías (útil para extensiones futuras)
      '@typescript-eslint/no-empty-interface': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      // Flexibilizar reglas para decoradores de Swagger
      '@typescript-eslint/ban-types': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
    },
  },
  // Configuración específica para archivos de test
  {
    files: ['**/*.spec.ts', '**/*.test.ts', 'test/**/*.ts'],
    rules: {
      // Allow any in tests
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/unbound-method': 'off',
      // Allow undefined variables in tests (like FormData)
      'no-undef': 'off',
      // Allow console in tests
      'no-console': 'off',
    },
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'module',
      globals: {
        node: true,
      },
    },
  },
  {
    ignores: ['dist/', 'node_modules/', 'coverage/', 'eslint.config.js'],
  },
];
