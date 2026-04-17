import type { Config } from 'jest'

const shared: Config = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: {
          jsx: 'react-jsx',
          module: 'commonjs',
        },
      },
    ],
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^msw/node$': '<rootDir>/node_modules/msw/node',
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
  },
  collectCoverageFrom: ['app/**/*.{ts,tsx}', '!app/**/*.d.ts'],
  coverageThreshold: {
    global: {
      lines: 80,
      branches: 75,
      functions: 85,
      statements: 80,
    },
  },
}

const config: Config = {
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: 'reports/junit',
        outputName: 'junit.xml',
      },
    ],
  ],
  projects: [
    {
      ...shared,
      displayName: 'unit',
      testMatch: ['<rootDir>/__tests__/unit/**/*.test.ts?(x)'],
    },
    {
      ...shared,
      displayName: 'integration',
      testMatch: ['<rootDir>/__tests__/integration/**/*.test.ts?(x)'],
    },
    {
      ...shared,
      displayName: 'mocks',
      testMatch: ['<rootDir>/__tests__/mocks/**/*.test.ts?(x)'],
    },
  ],
}

export default config
