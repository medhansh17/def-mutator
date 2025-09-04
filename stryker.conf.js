/**
 * @type {import('@stryker-mutator/api/core').StrykerOptions}
 */
 module.exports = {
    mutator: 'typescript',
    testRunner: "jest",
    packageManager: "npm",
    reporters: ["html", "clear-text", "progress"],
    coverageAnalysis: "perTest",
    tsconfigFile: "tsconfig.json",
    mutate: [
      "src/**/*.ts",
      '!src/**/*.spec.ts',
    ],
    disableTypeChecks: "src/**/*.ts",
    jest: {
      configFile: "jest.config.ts"
    }
};
  