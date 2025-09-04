import { GoogleGenerativeAI } from "@google/generative-ai";
import { ILLMProvider, IMutationContext, ISemanticMutant } from "../interfaces";

export class GeminiLLMProvider implements ILLMProvider {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(apiKey: string, modelName: string = "gemini-1.5-pro") {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: modelName });
  }

  async generateSemanticMutants(
    context: IMutationContext
  ): Promise<ISemanticMutant[]> {
    const prompt = this.createSemanticMutationPrompt(context);

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return this.parseSemanticMutants(text);
    } catch (error) {
      console.error("Error generating semantic mutants:", error);
      return [];
    }
  }

  async generateDefenseTests(
    mutants: ISemanticMutant[],
    context: IMutationContext
  ): Promise<string> {
    const prompt = this.createDefenseTestPrompt(mutants, context);

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Error generating defense tests:", error);
      return "";
    }
  }

  async analyzeCodeForDefenseContext(code: string): Promise<IMutationContext> {
    const prompt = this.createAnalysisPrompt(code);

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return this.parseAnalysisResult(text, code);
    } catch (error) {
      console.error("Error analyzing code:", error);
      return this.createDefaultContext(code);
    }
  }

  private createSemanticMutationPrompt(context: IMutationContext): string {
    return `
You are DefMutator, an expert in defense system testing. Analyze this ${
      context.functionType
    } system code and generate realistic semantic mutations that simulate actual defense system failures.

ORIGINAL CODE:
\`\`\`typescript
${context.originalCode}
\`\`\`

SYSTEM TYPE: ${context.functionType}
FUNCTION: ${context.functionName}

Generate 5-8 realistic semantic mutations that could occur in real defense systems. Focus on:

1. **Communication Failures**: Signal loss, encryption errors, protocol timeouts
2. **Sensor Degradation**: GPS noise, radar interference, compass drift
3. **Power Management**: Battery drain, voltage drops, power cycling
4. **Timing Issues**: Synchronization errors, latency spikes, timeout conditions
5. **Environmental Factors**: Temperature extremes, vibration, electromagnetic interference

For each mutation, provide:
- A unique ID
- Realistic failure description
- Modified code that simulates the failure
- Risk level (low/medium/high/critical)
- Defense system impact explanation
- Line numbers affected

Format as JSON array:
[
  {
    "id": "semantic_mut_001",
    "description": "GPS signal degradation during missile guidance",
    "mutatedCode": "// code with realistic GPS noise simulation",
    "failureScenario": "GPS receiver experiences 3-5 second signal loss typical in electronic warfare environments",
    "riskLevel": "critical",
    "defenseSystemImpact": "Missile guidance becomes unreliable, potential target miss",
    "originalLine": 10,
    "mutatedLine": 10
  }
]

IMPORTANT: Generate mutations that defense engineers would actually test for, not random syntax changes.
`;
  }

  private createDefenseTestPrompt(
    mutants: ISemanticMutant[],
    context: IMutationContext
  ): string {
    const mutantDescriptions = mutants
      .map((m) => `- ${m.description} (${m.riskLevel} risk)`)
      .join("\n");

    return `
You are a defense system test engineer. Generate comprehensive Jest test cases for these realistic failure scenarios:

SYSTEM TYPE: ${context.functionType}
ORIGINAL FUNCTION: ${context.functionName}

FAILURE SCENARIOS TO TEST:
${mutantDescriptions}

ORIGINAL CODE:
\`\`\`typescript
${context.originalCode}
\`\`\`

Generate Jest test suite that:

1. **Tests each failure scenario realistically**
2. **Verifies system behavior under stress**
3. **Checks failover mechanisms**
4. **Validates error handling**
5. **Ensures graceful degradation**

Include tests for:
- Normal operation baseline
- Each mutation scenario
- Recovery procedures
- Error propagation
- System state consistency
- Performance under failure

Format as complete Jest test file with proper imports, setup, and teardown.
Use describe blocks to organize by failure type.
Include detailed comments explaining the defense-specific test logic.

Example structure:
\`\`\`typescript
import { YourServiceClass } from './your-service';

describe('Defense System Failure Testing - ${context.functionName}', () => {
  let service: YourServiceClass;
  
  beforeEach(() => {
    service = new YourServiceClass();
  });

  describe('GPS Degradation Scenarios', () => {
    it('should handle 3-second GPS signal loss during critical navigation', () => {
      // Test implementation
    });
  });
  
  // More test groups...
});
\`\`\`
`;
  }

  private createAnalysisPrompt(code: string): string {
    return `
Analyze this TypeScript code to determine its defense system context and characteristics:

\`\`\`typescript
${code}
\`\`\`

Determine:
1. Function type: sensor, communication, navigation, weapon, power, control, or generic
2. Main function names
3. Dependencies and imports
4. Potential failure points
5. Defense system relevance

Respond in JSON format:
{
  "functionType": "sensor|communication|navigation|weapon|power|control|generic",
  "functionName": "primary function name",
  "dependencies": ["list", "of", "dependencies"],
  "defenseRelevance": "explanation of how this relates to defense systems",
  "failurePoints": ["potential", "failure", "scenarios"]
}
`;
  }

  private parseSemanticMutants(response: string): ISemanticMutant[] {
    try {
      // Extract JSON from response
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error("No JSON found in response");
      }

      const mutants = JSON.parse(jsonMatch[0]);
      return mutants.map((mutant: any) => ({
        id: mutant.id || `mut_${Date.now()}`,
        description: mutant.description || "Unknown mutation",
        mutatedCode: mutant.mutatedCode || "",
        failureScenario: mutant.failureScenario || "",
        riskLevel: mutant.riskLevel || "medium",
        defenseSystemImpact: mutant.defenseSystemImpact || "",
        originalLine: mutant.originalLine || 1,
        mutatedLine: mutant.mutatedLine || 1,
      }));
    } catch (error) {
      console.error("Failed to parse semantic mutants:", error);
      return [];
    }
  }

  private parseAnalysisResult(
    response: string,
    originalCode: string
  ): IMutationContext {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No JSON found in analysis response");
      }

      const analysis = JSON.parse(jsonMatch[0]);

      return {
        filePath: "",
        originalCode,
        functionName: analysis.functionName || "unknown",
        functionType: analysis.functionType || "generic",
        dependencies: analysis.dependencies || [],
      };
    } catch (error) {
      console.error("Failed to parse analysis result:", error);
      return this.createDefaultContext(originalCode);
    }
  }

  private createDefaultContext(code: string): IMutationContext {
    return {
      filePath: "",
      originalCode: code,
      functionName: "unknown",
      functionType: "generic",
      dependencies: [],
    };
  }
}
