module.exports = {
	"parser": "babel-eslint",
	"env": {
		"es6": true,
		"node": true,
		"jest": true,
		"browser": true,
		"commonjs": true
	},
	"extends": [
		"eslint:recommended",
		"react-app",
		"plugin:jsx-a11y/recommended"
	],
	"globals": {
		"ENV": true
	},
	"plugins": [
		"react",
		"jsx-a11y",
		"react-hooks",
		"flowtype",
	],
	"settings": {
		"import/resolver": "webpack",
		"import/core-modules": [
			"fs",
			"path",
			"os"
		]
	},
	"rules": {
		"react-hooks/rules-of-hooks": 2,
		"react-hooks/exhaustive-deps": 2,
		"jsx-a11y/href-no-hash": 0,
		"quotes": [
			2,
			"double",
			{
				"allowTemplateLiterals": true
			}
		],
		"strict": 0,
		"no-unused-vars": [
			2,
			{
				"vars": "all",
				"args": "none"
			}
		],
		"eqeqeq": 0,
		"no-var": 2,
		"no-process-exit": 0,
		"no-underscore-dangle": 0,
		"no-loop-func": 0,
		"no-console": 0,
		"key-spacing": 0,
		"no-mixed-spaces-and-tabs": 1,
		"semi": [
			2,
			"always"
		],
		"no-trailing-spaces": [
			2,
			{
				"skipBlankLines": false
			}
		],
		"camelcase": [
			1,
			{
				"properties": "never"
			}
		],
		"object-curly-spacing": [
			2,
			"always"
		],
		"react/jsx-no-bind": 2,
		"react/require-render-return": 2,
		"react/jsx-boolean-value": 2,
		"react/jsx-key": 2,
		"react/jsx-uses-vars": 1,
		"react/jsx-uses-react": 1,
		"react/prefer-es6-class": 2,
		"react/jsx-pascal-case": 2,
		"react/no-direct-mutation-state": 2,
		"react/react-in-jsx-scope": 2,
		"react/jsx-no-duplicate-props": 2,
		"react/no-deprecated": 2,
		"react/jsx-no-undef": 2,
		"react/no-unknown-property": 2,
		"react/prop-types": 0,
		"react/jsx-quotes": 0,
		"react/jsx-closing-bracket-location": 0,
		"react/jsx-equals-spacing": [
			1,
			"never"
		],
		// "react/jsx-first-prop-new-line": 1,
		"jsx-quotes": 0,
		"react/jsx-sort-prop-types": 0,
		"react/jsx-filename-extension": 0,
		"react/forbid-prop-types": 0,
		"react/display-name": 0,
		"react/no-unused-prop-types": 0,
		"react/require-default-props": 0,
		"react/sort-comp": 0,
		"jsx-a11y/click-events-have-key-events": 0,
		"jsx-a11y/no-noninteractive-tabindex": 0,
		"jsx-a11y/no-interactive-element-to-noninteractive-role": 0,
		"jsx-a11y/no-noninteractive-element-to-interactive-role": 0,
		"jsx-a11y/no-noninteractive-element-interactions": 0,
		"jsx-a11y/no-onchange": 0,
		"jsx-a11y/label-has-for": [
			1,
			{
				"components": [
					"Label"
				],
				"required": {
					"every": [
						"nesting",
						"id"
					]
				},
				"allowChildren": true
			}
		],
		"no-duplicate-imports": 0,
		"import/no-extraneous-dependencies": [
			2,
			{
				"devDependencies": [
					"!(src|lib)/**"
				],
				"optionalDependencies": false,
				"peerDependencies": [
					"packages/**/src/**",
					"packages/ui/**/src/**",
				]
			}
		],
		"flowtype/no-types-missing-file-annotation": 1,
		"import/no-unresolved": 0,
		"import/no-named-as-default": 0,
		"import/extensions": 0,
		"import/no-dynamic-require": 0,
		"import/no-named-as-default-member": 1,
		"import/prefer-default-export": 0,
		"import/no-webpack-loader-syntax": 0,
		"import/no-duplicates": 2,
		"jsx-a11y/no-static-element-interactions": 0,
		"jsx-a11y/alt-text": 0,
		"jsx-a11y/media-has-caption": 0,
		"jsx-a11y/anchor-is-valid": 1
	}
};