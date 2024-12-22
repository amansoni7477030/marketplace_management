module.exports = {
    testEnvironment: 'node',
    setupFilesAfterEnv: ['<rootDir>/src/setupIntegrationTests.js'],
    testMatch: [
      '<rootDir>/src/integrationTests/**/*.integration.test.js',
    ],
  };
  