/** @type {import('jest').Config} */
module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  // Алиасы из tsconfig.json: Metro понимает их сам, Jest — нет.
  moduleNameMapper: {
    '^@/assets/(.*)$': '<rootDir>/assets/$1',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testPathIgnorePatterns: ['/node_modules/', '/.expo/', '/ios/', '/android/'],
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/app/**', '!**/*.d.ts'],
};
