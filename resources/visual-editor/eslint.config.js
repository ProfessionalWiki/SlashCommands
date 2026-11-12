'use strict';

const { defineConfig, globalIgnores } = require( 'eslint/config' );
const wikimedia = require( 'eslint-config-wikimedia/flat' );

module.exports = defineConfig( [
	globalIgnores( [
		'dist/',
		'**/*.json',
		'**/*.yml'
	] ),
	{
		extends: [ wikimedia( 'common', 'node', 'language/rules-es2017' ) ]
	},
	{
		files: [ '**/*.ts' ],
		languageOptions: {
			// wikimedia( 'node' ) makes all files scripts, because package.json has no "type"
			sourceType: 'module'
		},
		rules: {
			'@typescript-eslint/no-explicit-any': 'off',
			// This rule expects imports to be .js files, not .ts.
			'n/no-missing-import': 'off'
		}
	}
] );
