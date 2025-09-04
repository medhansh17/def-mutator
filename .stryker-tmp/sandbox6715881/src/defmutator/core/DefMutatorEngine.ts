// @ts-nocheck
import * as fs from 'fs';
import * as path from 'path';
import { ILLMProvider, IMutationContext, ISemanticMutant } from '../interfaces';
import { GeminiLLMProvider } from '../providers';

export class DefMutatorEngine {
    private llmProvider: ILLMProvider;
    private outputDir: string;

    constructor(geminiApiKey: string, modelName: string = 'gemini-1.5-pro', outputDir: string = './defmutator-output') {
        this.llmProvider = new GeminiLLMProvider(geminiApiKey, modelName);
        this.outputDir = outputDir;
        this.ensureOutputDirectory();
    }

    async analyzeAndMutateFile(filePath: string): Promise<{
        mutants: ISemanticMutant[];
        testCode: string;
        context: IMutationContext;
    }> {
        try {
            // Read the source file
            const sourceCode = fs.readFileSync(filePath, 'utf-8');
            
            // Analyze the code for defense context
            const context = await this.llmProvider.analyzeCodeForDefenseContext(sourceCode);
            context.filePath = filePath;
            
            console.log(`\n🔍 Analyzing ${path.basename(filePath)} as ${context.functionType} system...`);
            
            // Generate semantic mutants
            const mutants = await this.llmProvider.generateSemanticMutants(context);
            console.log(`🧬 Generated ${mutants.length} semantic mutants for defense scenarios`);
            
            // Generate enhanced test cases
            const testCode = await this.llmProvider.generateDefenseTests(mutants, context);
            console.log(`🧪 Generated enhanced defense-specific test suite`);
            
            // Save results
            await this.saveResults(filePath, mutants, testCode, context);
            
            return { mutants, testCode, context };
            
        } catch (error) {
            console.error(`Error processing ${filePath}:`, error);
            throw error;
        }
    }

    async processProject(sourceDir: string, pattern: string = '**/*.ts'): Promise<void> {
        const glob = require('glob');
        const files = glob.sync(pattern, { 
            cwd: sourceDir,
            ignore: ['**/*.spec.ts', '**/*.test.ts', '**/node_modules/**', '**/dist/**']
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
                    ...result
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
        context: IMutationContext
    ): Promise<void> {
        const fileName = path.basename(filePath, '.ts');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        
        // Save mutants as JSON
        const mutantsFile = path.join(this.outputDir, `${fileName}-mutants-${timestamp}.json`);
        fs.writeFileSync(mutantsFile, JSON.stringify({
            sourceFile: filePath,
            context,
            mutants,
            generatedAt: new Date().toISOString()
        }, null, 2));

        // Save enhanced test file
        const testFile = path.join(this.outputDir, `${fileName}-defense-tests-${timestamp}.spec.ts`);
        fs.writeFileSync(testFile, testCode);

        console.log(`💾 Results saved:`);
        console.log(`   📊 Mutants: ${mutantsFile}`);
        console.log(`   🧪 Tests: ${testFile}`);
    }

    private async generateSummaryReport(results: any[]): Promise<void> {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const reportFile = path.join(this.outputDir, `defmutator-summary-${timestamp}.md`);
        
        let report = `# DefMutator Analysis Report\n\n`;
        report += `Generated: ${new Date().toISOString()}\n\n`;
        report += `## Summary\n\n`;
        report += `- **Files Analyzed**: ${results.length}\n`;
        report += `- **Total Mutants**: ${results.reduce((sum, r) => sum + r.mutants.length, 0)}\n`;
        report += `- **System Types**: ${[...new Set(results.map(r => r.context.functionType))].join(', ')}\n\n`;

        report += `## Risk Assessment\n\n`;
        const riskCounts = results.reduce((acc, r) => {
            r.mutants.forEach((m: ISemanticMutant) => {
                acc[m.riskLevel] = (acc[m.riskLevel] || 0) + 1;
            });
            return acc;
        }, {} as Record<string, number>);

        Object.entries(riskCounts).forEach(([risk, count]) => {
            report += `- **${risk.toUpperCase()}**: ${count} mutations\n`;
        });

        report += `\n## File Analysis\n\n`;
        results.forEach(result => {
            report += `### ${result.file}\n\n`;
            report += `- **System Type**: ${result.context.functionType}\n`;
            report += `- **Function**: ${result.context.functionName}\n`;
            report += `- **Mutants Generated**: ${result.mutants.length}\n`;
            report += `- **Risk Distribution**: ${result.mutants.reduce((acc: Record<string, number>, m: ISemanticMutant) => {
                acc[m.riskLevel] = (acc[m.riskLevel] || 0) + 1;
                return acc;
            }, {})}\n\n`;
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
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
