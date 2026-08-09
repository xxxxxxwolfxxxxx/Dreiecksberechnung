import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({ dir: './' })

const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  // Worktrees von Claude Code enthalten eine vollstaendige Kopie des Projekts.
  // Ohne diesen Ausschluss laufen deren veraltete Tests bei jedem Lauf mit.
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.claude/'],
}

export default createJestConfig(config)
