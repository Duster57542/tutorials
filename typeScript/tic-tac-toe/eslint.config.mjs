import { fixupConfigRules, fixupPluginRules } from '@eslint/compat'
import react from 'eslint-plugin-react'
import typescriptEslint from '@typescript-eslint/eslint-plugin'
import reactHooks from 'eslint-plugin-react-hooks'
import unicorn from 'eslint-plugin-unicorn'
import prettier from 'eslint-plugin-prettier'
import etc from 'eslint-plugin-etc'
import globals from 'globals'
import tsParser from '@typescript-eslint/parser'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all,
})

export default [
	...fixupConfigRules(compat.extends('airbnb', 'plugin:unicorn/recommended', 'plugin:etc/recommended', 'plugin:react/recommended', 'prettier')),
	{
		plugins: {
			react: fixupPluginRules(react),
			'@typescript-eslint': fixupPluginRules(typescriptEslint),
			'react-hooks': fixupPluginRules(reactHooks),
			unicorn: fixupPluginRules(unicorn),
			prettier,
			etc: fixupPluginRules(etc), // Added etc plugin
		},

		languageOptions: {
			globals: {
				...globals.browser,
			},

			parser: tsParser,
			ecmaVersion: 12,
			sourceType: 'module',

			parserOptions: {
				ecmaFeatures: {
					jsx: true,
				},

				project: './tsconfig.json',
			},
		},

		settings: {
			'import/resolver': {
				typescript: {},
			},

			react: {
				version: '18',
			},
		},

		rules: {
			'prettier/prettier': 'error',
			'no-use-before-define': 'off',
			'@typescript-eslint/no-use-before-define': ['error'],
			'react/react-in-jsx-scope': 'off',

			'react/jsx-filename-extension': [
				'warn',
				{
					extensions: ['.tsx', '.js'],
				},
			],

			'import/extensions': [
				'error',
				'ignorePackages',
				{
					ts: 'never',
					tsx: 'never',
				},
			],

			'no-shadow': 'off',
			'@typescript-eslint/no-shadow': ['error'],
			'max-len': 'off',
			'react-hooks/rules-of-hooks': 'error',
			'react-hooks/exhaustive-deps': 'warn',

			'react/function-component-definition': [
				'error',
				{
					namedComponents: 'arrow-function',
				},
			],

			'import/prefer-default-export': 'warn',
			'comma-dangle': 'off',

			'import/no-unresolved': [
				'error',
				{
					ignore: ['^react$'],
				},
			],

			'import/no-extraneous-dependencies': [
				'error',
				{
					devDependencies: ['src/stories/**/*.stories.tsx'],
				},
			],

			'no-multiple-empty-lines': 'error',
			'unicorn/prevent-abbreviations': 'off',

			'unicorn/filename-case': [
				'error',
				{
					case: 'pascalCase',
				},
			],

			'no-tabs': 'off',
			semi: ['error', 'never'],
			'linebreak-style': ['error', 'windows'],
			'jsx-quotes': ['error', 'prefer-single'],
			'prefer-arrow-callback': 'error',
			indent: 'off',
			'unicorn/switch-case-braces': 'off',
			'@typescript-eslint/explicit-function-return-type': 'off',
			'@typescript-eslint/no-empty-function': 'off',
			'jsx-a11y/click-events-have-key-events': 'warn',
			'jsx-a11y/no-static-element-interactions': 'warn',
			'jsx-a11y/alt-text': 'warn',
			radix: 'off',
			'unicorn/prefer-number-properties': 'off',
			'sort-keys': 'off',
			'no-unused-vars': 'off',
			'@typescript-eslint/no-unused-vars': ['error'],
			'react/require-default-props': 'off',
			'react/destructuring-assignment': 'off',
		},
	},
	{
		ignores: [
			'**/dist/*', // Assuming you want to ignore everything in the dist directory
			'**/temp.js',
			'config/*',
			'**/.*', // To ignore dotfiles as mentioned
			'webpack.config.js',
		],
	},
]

