import path from 'path'
import { fileURLToPath } from 'url'

import eslint from '@eslint/js'
import { defineConfig, globalIgnores } from 'eslint/config'
import tseslint from 'typescript-eslint'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import globals from 'globals'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname)

const commonRules = {
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-deprecated': 'warn',
}

const commonParserOptions = {
    project: './tsconfig.eslint.json',
    tsconfigRootDir: rootDir,
}

export default defineConfig(
    globalIgnores([
        '**/node_modules/**',
        '**/dist/**',
        '**/build/**',
        'server/data/**',
        'server/drizzle/**',
        '**/.DS_Store',
        '**/.env',
        '**/.env.example',
        'package-lock.json',
    ]),
    eslint.configs.recommended,
    tseslint.configs.recommended,
    {
        files: ['server/src/**/*.{ts,tsx}'],
        languageOptions: {
            parserOptions: commonParserOptions,
            globals: {
                ...globals.node,
            },
        },
        rules: {
            ...commonRules,
        },
    },
    {
        files: ['server/scripts/**/*.js'],
        languageOptions: {
            globals: {
                ...globals.node,
            },
        },
        rules: {
            '@typescript-eslint/no-require-imports': 'off',
        },
    },
    {
        files: ['web/src/**/*.{ts,tsx}'],
        languageOptions: {
            parserOptions: commonParserOptions,
            globals: {
                ...globals.browser,
            },
        },
        plugins: {
            react,
            'react-hooks': reactHooks,
            'jsx-a11y': jsxA11y,
        },
        rules: {
            ...commonRules,
            'react/react-in-jsx-scope': 'off',
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'warn',
        },
    },
    {
        files: [
            '*.config.js',
            '*.config.ts',
            'prettier.config.js',
            'web/vite.config.ts',
        ],
        languageOptions: {
            parserOptions: { project: null },
            globals: {
                ...globals.node,
            },
        },
    },
)
