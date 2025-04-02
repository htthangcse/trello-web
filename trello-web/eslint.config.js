// import js from '@eslint/js'
// import globals from 'globals'
// import reactHooks from 'eslint-plugin-react-hooks'
// import reactRefresh from 'eslint-plugin-react-refresh'

// export default [
//   { ignores: ['dist'] },
//   {
//     files: ['**/*.{js,jsx}'],
//     languageOptions: {
//       ecmaVersion: 2020,
//       globals: globals.browser,
//       parserOptions: {
//         ecmaVersion: 'latest',
//         ecmaFeatures: { jsx: true },
//         sourceType: 'module',
//       },
//     },
//     plugins: {
//       'react-hooks': reactHooks,
//       'react-refresh': reactRefresh,
//     },
//     rules: {
//       ...js.configs.recommended.rules,
//       ...reactHooks.configs.recommended.rules,
//       'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
//       'react-refresh/only-export-components': [
//         'warn',
//         { allowConstantExport: true },
//       ],
//     },
//   },
// ]



// Updated by trungquandev.com's author on May 13 2023
// Sample Eslint config for React project
// module.exports = {
//   env: { browser: true, es2020: true, node: true },
//   extends: [
//     'eslint:recommended',
//     'plugin:react/recommended',
//     'plugin:react/jsx-runtime',
//     'plugin:react-hooks/recommended'
//   ],
//   parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
//   settings: { react: { version: '18.2' } },
//   plugins: [
//     'react',
//     'react-hooks',
//     'react-refresh'
//   ],
//   rules: {
//     // react
//     'react-refresh/only-export-components': 'warn',
//     'react-hooks/rules-of-hooks': 'error',
//     'react-hooks/exhaustive-deps': 'warn',
//     'react/prop-types': 0,
//     'react/display-name': 0,
    
//     // MUI
//     'no-restricted-imports': [
//       'error',
//       {
//         'patterns': ["@mui/*/*/*"]
//       }
//     ],
    
//     // Common
//     'no-console': 1,
//     'no-lonely-if': 1,
//     'no-unused-vars': 1,
//     'no-trailing-spaces': 1,
//     'no-multi-spaces': 1,
//     'no-multiple-empty-lines': 1,
//     'space-before-blocks': ['error', 'always'],
//     'object-curly-spacing': [1, 'always'],
//     'indent': ['warn', 2],
//     'semi': [1, 'never'],
//     'quotes': ['error', 'single'],
//     'array-bracket-spacing': 1,
//     'linebreak-style': 0,
//     'no-unexpected-multiline': 'warn',
//     'keyword-spacing': 1,
//     'comma-dangle': 1,
//     'comma-spacing': 1,
//     'arrow-spacing': 1
//   }
// }



export default {
  env: { browser: true, es2020: true, node: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended'
  ],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react', 'react-hooks', 'react-refresh'],
  rules: {
    'react-refresh/only-export-components': 'warn',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'react/prop-types': 0,
    'react/display-name': 0,
    'no-restricted-imports': ['error', { patterns: ['@mui/*/*/*'] }],
    'no-console': 1,
    'no-lonely-if': 1,
    'no-unused-vars': 1,
    'no-trailing-spaces': 1,
    'no-multi-spaces': 1,
    'no-multiple-empty-lines': 1,
    'space-before-blocks': ['error', 'always'],
    'object-curly-spacing': [1, 'always'],
    indent: ['warn', 2],
    semi: [1, 'never'],
    quotes: ['error', 'single'],
    'array-bracket-spacing': 1,
    'linebreak-style': 0,
    'no-unexpected-multiline': 'warn',
    'keyword-spacing': 1,
    'comma-dangle': 1,
    'comma-spacing': 1,
    'arrow-spacing': 1
  }
}