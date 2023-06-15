module.exports = {
	extends: [
		'wikimedia',
		'wikimedia/node',
		'wikimedia/language/rules-es2017',
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'@wmde/wikimedia-typescript'
	],
	parser: '@typescript-eslint/parser',
	plugins: [ '@typescript-eslint' ],
	root: true,
	rules: {
		'@typescript-eslint/no-explicit-any': 'off',

		// This rule expects imports to be .js files, not .ts.
		'node/no-missing-import': 'off'
	}
};
