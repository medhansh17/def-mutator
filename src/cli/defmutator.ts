#!/usr/bin/env node

import * as dotenv from "dotenv";
import { DefMutatorEngine } from "../defmutator";

dotenv.config();

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
    showHelp();
    return;
  }

  const geminiApiKey = process.env.GEMINI_API_KEY;
  if (!geminiApiKey) {
    console.error("❌ Error: GEMINI_API_KEY environment variable is required");
    console.log("Please set your Gemini API key in the .env file");
    process.exit(1);
  }

  const sourceDir = args[0] || "./src";
  const pattern = args[1] || "**/*.ts";
  const modelName = process.env.GEMINI_MODEL || "gemini-1.5-pro";

  console.log(
    "🛡️  DefMutator - LLM-Guided Semantic Mutation Testing for Defense Systems"
  );
  console.log("=".repeat(80));

  try {
    const engine = new DefMutatorEngine(geminiApiKey, modelName);
    await engine.processProject(sourceDir, pattern);

    console.log("\n✅ DefMutator analysis completed successfully!");
    console.log("📊 Check the defmutator-output directory for results");
  } catch (error) {
    console.error("❌ DefMutator analysis failed:", error);
    process.exit(1);
  }
}

function showHelp() {
  console.log(`
🛡️  DefMutator - LLM-Guided Semantic Mutation Testing for Defense Systems

USAGE:
    npm run defmutator [source_directory] [file_pattern]

ARGUMENTS:
    source_directory    Directory to analyze (default: ./src)
    file_pattern       File pattern to match (default: **/*.ts)

EXAMPLES:
    npm run defmutator                          # Analyze all .ts files in ./src
    npm run defmutator ./src "**/*.service.ts"  # Analyze only service files
    npm run defmutator ./src "**/*.ts"          # Analyze all TypeScript files

ENVIRONMENT VARIABLES:
    GEMINI_API_KEY     Your Google Gemini API key (required)
    GEMINI_MODEL       Gemini model to use (default: gemini-1.5-pro)

OUTPUT:
    Results will be saved in the ./defmutator-output directory:
    - JSON files with semantic mutants
    - Enhanced test files with defense-specific scenarios
    - Summary reports in Markdown format

DEFENSE SYSTEM FOCUS:
    DefMutator specializes in testing realistic failure scenarios for:
    • Missile guidance systems      • Radar and sensor systems
    • Satellite communications      • Drone control systems  
    • Naval combat systems         • Ground vehicle defense
    • Cyber defense systems        • Power and control systems

For more information: https://github.com/your-repo/defmutator
`);
}

if (require.main === module) {
  main().catch(console.error);
}
