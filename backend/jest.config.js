module.exports = {
    testEnvironment: 'node',
    verbose: true,
    roots: ['<rootDir>/services/'],
    testMatch: ['**/*.test.js'],
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coveragePathIgnorePatterns: ['/node_modules/'],
    testPathIgnorePatterns: ['/node_modules/']
  };