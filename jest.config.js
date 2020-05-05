module.exports = {
  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
  testMatch: [
    '<rootDir>/src/**/*.spec.ts'
  ],
  globals: {
    'ts-jest': {
      babelConfig: true,
      diagnostics: false
    }
  }
}
