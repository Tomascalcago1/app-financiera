import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  
  // Rules for browser-based JavaScript/React files
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2021
      },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      // Downgrade style and non-breaking rules to warnings so they don't block the build
      'no-unused-vars': 'warn',
      'no-useless-assignment': 'warn',
      'no-empty': 'warn',
      'react-hooks/static-components': 'warn',
      'react-hooks/set-state-in-effect': 'warn',
      
      // Ensure React imports are not strictly enforced (React 17+ JSX transform)
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
    }
  },

  // Configuration for test files (running under Vitest/Node)
  {
    files: ['src/tests/**/*.{js,jsx}'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
        ...globals.es2021,
        describe: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        vi: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly'
      }
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'off',
      'no-empty': 'warn'
    }
  },

  // Configuration for Node.js configuration files and build scripts
  {
    files: [
      'scripts/**/*.js',
      'vite.config.js',
      'eslint.config.js',
      'vitest.config.js',
      'test_fire.mjs'
    ],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2021
      }
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'off',
      'no-empty': 'warn'
    }
  }
])
