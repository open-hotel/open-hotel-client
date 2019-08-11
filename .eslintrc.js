/**
 * Got config from https://dev.to/robertcoopercode/using-eslint-and-prettier-in-a-typescript-project-53jb
 */
module.exports =  {
    parser:  '@typescript-eslint/parser',  // Specifies the ESLint parser
    extends:  [
        'plugin:@typescript-eslint/recommended',  // Uses the recommended rules from the @typescript-eslint/eslint-plugin
        'plugin:prettier/recommended',
    ],
    parserOptions:  {
        ecmaVersion:  2018,  // Allows for the parsing of modern ECMAScript features
        sourceType:  'module',  // Allows for the use of imports
    },
    rules:  {
        // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
        // e.g. "@typescript-eslint/explicit-function-return-type": "off",
        '@typescript-eslint/explicit-member-accessibility': 'off',
        '@typescript-eslint/camelcase': 'off',
        '@typescript-eslint/no-parameter-properties': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-use-before-define': 'off',
        '@typescript-eslint/member-delimiter-style': [
            2,
            {
              multiline: {
                delimiter: 'none',
                requireLast: false,
              },
              singleline: {
                delimiter: 'semi',
                requireLast: true,
              },
            },
        ],
    },
}
