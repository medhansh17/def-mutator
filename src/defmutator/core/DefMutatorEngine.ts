import * as fs from "fs";
import * as path from "path";
import { ILLMProvider, IMutationContext, ISemanticMutant } from "../interfaces";
import { GeminiLLMProvider } from "../providers";
import { ContextRiskAnalyzer } from "./ContextRiskAnalyzer";
import { RLMutantScheduler } from "./RLMutantScheduler";
import { MultimodalContextAnalyzer } from "./MultimodalContextAnalyzer";

export class DefMutatorEngine {
  private llmProvider: ILLMProvider;
  private outputDir: string;
  private contextAnalyzer: ContextRiskAnalyzer;
  private rlScheduler: RLMutantScheduler;
  private multimodalAnalyzer: MultimodalContextAnalyzer;

  constructor(
    geminiApiKey: string,
    modelName: string = "gemini-1.5-pro",
    outputDir: string = "./defmutator-output"
  ) {
    this.llmProvider = new GeminiLLMProvider(geminiApiKey, modelName);
    this.outputDir = outputDir;
    this.contextAnalyzer = new ContextRiskAnalyzer();
    this.rlScheduler = new RLMutantScheduler();
    this.multimodalAnalyzer = new MultimodalContextAnalyzer();
    this.ensureOutputDirectory();
  }

  async analyzeAndMutateFile(
    filePath: string
  ): Promise<{
    mutants: ISemanticMutant[];
    testCode: string;
    context: IMutationContext;
  }> {
    try {
      // Read the source file
      const sourceCode = fs.readFileSync(filePath, "utf-8");

      // Analyze the code for defense context
      const context = await this.llmProvider.analyzeCodeForDefenseContext(
        sourceCode
      );
      context.filePath = filePath;

      console.log(
        `\n🔍 Analyzing ${path.basename(filePath)} as ${
          context.functionType
        } system...`
      );

      // Generate semantic mutants
      const mutants = await this.llmProvider.generateSemanticMutants(context);
      console.log(
        `🧬 Generated ${mutants.length} semantic mutants for defense scenarios`
      );

      // Generate enhanced test cases
      const testCode = await this.llmProvider.generateDefenseTests(
        mutants,
        context
      );
      console.log(`🧪 Generated enhanced defense-specific test suite`);

      // Advanced Analysis: Context-Risk Correlation
      console.log(`📊 Performing Context-Risk Correlation Analysis...`);
      const contextRiskMetrics = this.contextAnalyzer.analyzeContextRiskCorrelation(
        mutants,
        context
      );
      console.log(
        `   ✓ Context-aware mutations: ${contextRiskMetrics.improvementFactor.toFixed(
          1
        )}× better detection`
      );

      // Advanced Analysis: RL-based Scheduling
      console.log(`🤖 Optimizing mutant execution with RL scheduling...`);
      const schedulingMetrics = this.rlScheduler.optimizeSchedule(mutants);
      console.log(
        `   ✓ Cost reduction: ${schedulingMetrics.costReduction.toFixed(
          0
        )}%, Detection: ${(schedulingMetrics.detectionRate * 100).toFixed(0)}%`
      );

      // Advanced Analysis: Multimodal Context
      console.log(`🔬 Running Multimodal Context Analysis...`);
      const multimodalResult = this.multimodalAnalyzer.analyzeMultimodal(
        context,
        mutants
      );
      console.log(
        `   ✓ High-risk regions: ${
          multimodalResult.highRiskRegions.length
        }, Improvement: ${multimodalResult.improvementFactor.toFixed(1)}×`
      );

      // Save results with advanced metrics
      await this.saveResults(
        filePath,
        mutants,
        testCode,
        context,
        contextRiskMetrics,
        schedulingMetrics,
        multimodalResult
      );

      return { mutants, testCode, context };
    } catch (error) {
      console.error(`Error processing ${filePath}:`, error);
      throw error;
    }
  }

  async processProject(
    sourceDir: string,
    pattern: string = "**/*.ts"
  ): Promise<void> {
    const glob = require("glob");
    const files = glob.sync(pattern, {
      cwd: sourceDir,
      ignore: [
        "**/*.spec.ts",
        "**/*.test.ts",
        "**/node_modules/**",
        "**/dist/**",
      ],
    });

    console.log(`\n🚀 DefMutator Analysis Starting...`);
    console.log(`📁 Source Directory: ${sourceDir}`);
    console.log(`🎯 Pattern: ${pattern}`);
    console.log(`📄 Found ${files.length} files to analyze\n`);

    const results = [];

    for (const file of files) {
      const fullPath = path.join(sourceDir, file);
      try {
        const result = await this.analyzeAndMutateFile(fullPath);
        results.push({
          file: file,
          ...result,
        });

        // Add a small delay to respect API rate limits
        await this.delay(1000);
      } catch (error) {
        console.error(`❌ Failed to process ${file}:`, error);
      }
    }

    // Generate summary report
    await this.generateSummaryReport(results);
  }

  private async saveResults(
    filePath: string,
    mutants: ISemanticMutant[],
    testCode: string,
    context: IMutationContext,
    contextRiskMetrics?: any,
    schedulingMetrics?: any,
    multimodalResult?: any
  ): Promise<void> {
    const fileName = path.basename(filePath, ".ts");
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

    // Save mutants as JSON with advanced metrics
    const mutantsFile = path.join(
      this.outputDir,
      `${fileName}-mutants-${timestamp}.json`
    );
    fs.writeFileSync(
      mutantsFile,
      JSON.stringify(
        {
          sourceFile: filePath,
          context,
          mutants,
          advancedMetrics: {
            contextRiskCorrelation: contextRiskMetrics,
            rlScheduling: schedulingMetrics,
            multimodalAnalysis: multimodalResult,
          },
          generatedAt: new Date().toISOString(),
        },
        null,
        2
      )
    );

    // Save enhanced test file
    const testFile = path.join(
      this.outputDir,
      `${fileName}-defense-tests-${timestamp}.spec.ts`
    );
    fs.writeFileSync(testFile, testCode);

    // Save advanced analysis report
    if (contextRiskMetrics && schedulingMetrics && multimodalResult) {
      const reportFile = path.join(
        this.outputDir,
        `${fileName}-analysis-${timestamp}.md`
      );
      const report = this.generateAdvancedReport(
        fileName,
        contextRiskMetrics,
        schedulingMetrics,
        multimodalResult
      );
      fs.writeFileSync(reportFile, report);
      console.log(`💾 Results saved:`);
      console.log(`   📊 Mutants: ${mutantsFile}`);
      console.log(`   🧪 Tests: ${testFile}`);
      console.log(`   📋 Analysis: ${reportFile}`);
    } else {
      console.log(`💾 Results saved:`);
      console.log(`   📊 Mutants: ${mutantsFile}`);
      console.log(`   🧪 Tests: ${testFile}`);
    }
  }

  private generateAdvancedReport(
    fileName: string,
    contextRiskMetrics: any,
    schedulingMetrics: any,
    multimodalResult: any
  ): string {
    let report = `# DefMutator Advanced Analysis Report\n\n`;
    report += `**File**: ${fileName}\n`;
    report += `**Generated**: ${new Date().toISOString()}\n\n`;
    report += `---\n\n`;

    // Context-Risk Correlation
    report += this.contextAnalyzer.generateCorrelationReport(
      contextRiskMetrics
    );
    report += `\n---\n\n`;

    // RL Scheduling
    report += this.rlScheduler.generateSchedulingReport(schedulingMetrics);
    report += `\n---\n\n`;

    // Multimodal Analysis
    report += this.multimodalAnalyzer.generateMultimodalReport(
      multimodalResult
    );
    report += `\n---\n\n`;

    report += `## Summary\n\n`;
    report += `DefMutator employs three novel techniques:\n\n`;
    report += `1. **Context-Risk Correlation**: ${contextRiskMetrics.improvementFactor.toFixed(
      1
    )}× improvement through defense-aware mutation\n`;
    report += `2. **RL-based Scheduling**: ${schedulingMetrics.costReduction.toFixed(
      0
    )}% cost reduction with ${(schedulingMetrics.detectionRate * 100).toFixed(
      0
    )}%+ detection\n`;
    report += `3. **Multimodal Analysis**: ${multimodalResult.improvementFactor.toFixed(
      1
    )}× better fault detection in high-risk regions\n\n`;
    report += `These techniques combine to deliver superior mutation testing for defense-critical systems.\n`;

    return report;
  }

  private async generateSummaryReport(results: any[]): Promise<void> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const reportFile = path.join(
      this.outputDir,
      `defmutator-summary-${timestamp}.md`
    );

    let report = `# DefMutator Analysis Report\n\n`;
    report += `Generated: ${new Date().toISOString()}\n\n`;
    report += `## Summary\n\n`;
    report += `- **Files Analyzed**: ${results.length}\n`;
    report += `- **Total Mutants**: ${results.reduce(
      (sum, r) => sum + r.mutants.length,
      0
    )}\n`;
    report += `- **System Types**: ${[
      ...new Set(results.map((r) => r.context.functionType)),
    ].join(", ")}\n\n`;

    report += `## Risk Assessment\n\n`;
    const riskCounts = results.reduce(
      (acc, r) => {
        r.mutants.forEach((m: ISemanticMutant) => {
          acc[m.riskLevel] = (acc[m.riskLevel] || 0) + 1;
        });
        return acc;
      },
      {} as Record<string, number>
    );

    Object.entries(riskCounts).forEach(([risk, count]) => {
      report += `- **${risk.toUpperCase()}**: ${count} mutations\n`;
    });

    report += `\n## File Analysis\n\n`;
    results.forEach((result) => {
      report += `### ${result.file}\n\n`;
      report += `- **System Type**: ${result.context.functionType}\n`;
      report += `- **Function**: ${result.context.functionName}\n`;
      report += `- **Mutants Generated**: ${result.mutants.length}\n`;
      report += `- **Risk Distribution**: ${result.mutants.reduce(
        (acc: Record<string, number>, m: ISemanticMutant) => {
          acc[m.riskLevel] = (acc[m.riskLevel] || 0) + 1;
          return acc;
        },
        {}
      )}\n\n`;
    });

    fs.writeFileSync(reportFile, report);
    console.log(`\n📋 Summary report generated: ${reportFile}`);
  }

  private ensureOutputDirectory(): void {
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
