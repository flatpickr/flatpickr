module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    "^plugins/(.*)$": "<rootDir>/src/plugins/$1",
    "^index$": "<rootDir>/src/index.ts",
  },
  globals: {
    'ts-jest': {
      isolatedModules: true
    }
  }
};
