/**
 * Enhanced Stryker configuration with DefMutator semantic mutation support
 * @type {import('@stryker-mutator/api/core').StrykerOptions}
 */
module.exports = {
  mutator: "typescript",
  testRunner: "jest",
  packageManager: "npm",
  reporters: ["html", "clear-text", "progress", "json"],
  coverageAnalysis: "perTest",
  tsconfigFile: "tsconfig.json",

  // DefMutator enhanced mutation strategy
  mutate: [
    "src/**/*.ts",
    "!src/**/*.spec.ts",
    "!src/**/*.test.ts",
    "!src/defmutator/**", // Exclude DefMutator system itself
    "!src/cli/**",
  ],

  disableTypeChecks: "src/**/*.ts",

  jest: {
    configFile: "jest.config.ts",
    enableFindRelatedTests: true,
  },

  // DefMutator semantic mutation plugins
  plugins: ["@stryker-mutator/typescript", "@stryker-mutator/jest-runner"],

  // Enhanced thresholds for defense systems
  thresholds: {
    high: 90, // High standards for defense code
    low: 75, // Minimum acceptable coverage
    break: 70, // Build break threshold
  },

  // Timeout configuration for complex defense calculations
  timeoutMS: 30000,
  timeoutFactor: 2.0,

  // Advanced mutation controls
  mutationRange: {
    // Focus on critical defense system files
    start: {
      line: 1,
      column: 1,
    },
  },

  // File pattern for DefMutator integration
  buildCommand: "npm run build",

  // Custom mutation operators for defense systems
  mutatorOptions: {
    typescript: {
      // Preserve critical safety checks
      excludedMutations: [
        "ConditionalExpression", // Keep safety conditionals
        "BooleanLiteral", // Keep boolean safety flags
      ],
    },
  },

  // Semantic mutation integration
  semanticMutations: {
    enabled: true,
    provider: "gemini",
    scenarios: [
      "sensor-failure",
      "communication-loss",
      "power-degradation",
      "timing-errors",
      "navigation-drift",
    ],
  },

  // Defense-specific test configuration
  defenseConfig: {
    systemTypes: [
      "missile",
      "radar",
      "satellite",
      "drone",
      "naval",
      "ground",
      "cyber",
    ],
    riskLevels: ["low", "medium", "high", "critical"],
    failureScenarios: {
      gps: ["signal-loss", "jamming", "spoofing", "multipath"],
      communication: [
        "timeout",
        "encryption-failure",
        "link-down",
        "interference",
      ],
      sensor: ["drift", "noise", "saturation", "failure"],
      power: ["brownout", "spike", "failure", "drain"],
    },
  },
};
