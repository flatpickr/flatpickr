module.exports = {
    parser: "@typescript-eslint/parser", // Specifies the ESLint parser
    extends: [
        "plugin:@typescript-eslint/recommended", // Uses the recommended rules from the @typescript-eslint/eslint-plugin
        "prettier/@typescript-eslint", // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
        "plugin:prettier/recommended", // Prettier rules for eslint
    ],
    parserOptions: {
        ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
        sourceType: "module", // Allows for the use of imports
    },
    rules: {
        // TODO: The following rules are turned off but need to be addressed.
        "@typescript-eslint/no-use-before-define": "none",
        "@typescript-eslint/explicit-function-return-type": "none,",
        "@typescript-eslint/no-explicit-any": "none",
        "@typescript-eslint/prefer-interface": "none",
        "@typescript-eslint/no-object-literal-type-assertion": "none",
        "@typescript-eslint/camelcase": [
            "error",
            { allow: ["time_24hr", "zh_tw"] },
        ],
    },
};
