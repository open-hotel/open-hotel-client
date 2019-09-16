module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{js,jsx,ts}', '!**/node_modules/**', '!**/vendor/**', '!**/coverage/**'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  setupFiles: ['jest-canvas-mock'],
}
