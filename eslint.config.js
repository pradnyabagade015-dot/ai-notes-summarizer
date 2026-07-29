import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores([
    'dist',
    'backend/uploads/**',
    'backend/FlashcardPage.jsx',
    'backend/list_models.js',
    'backend/test_*.js',
    'backend/verify-note-upload.js',
    'src/MCQViewer.jsx',
  ]),
  {
    files: ['src/**/*.{js,jsx}', 'vite.config.js'],
    extends: [js.configs.recommended, reactHooks.configs.flat.recommended, reactRefresh.configs.vite],
    languageOptions: { globals: globals.browser, parserOptions: { ecmaFeatures: { jsx: true }, sourceType: 'module' } },
    rules: {
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/purity': 'off',
      'react-refresh/only-export-components': 'off',
    },
  },
  {
    files: ['backend/**/*.js'],
    extends: [js.configs.recommended],
    languageOptions: { globals: globals.node, parserOptions: { sourceType: 'commonjs' } },
    rules: { 'preserve-caught-error': 'off', 'no-unused-vars': ['error', { argsIgnorePattern: '^_' }] },
  },
])
