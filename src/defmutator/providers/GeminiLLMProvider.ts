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

COMPLETE DEFENSE SYSTEM CONTEXT:
This system includes:

1. SERVICES:
   - RadarTrackingService: Advanced radar for target detection, anti-jamming, interference detection
   - MissileGuidanceService: GPS-based missile navigation with backup systems
   - HealthService: System health monitoring
   - ExampleService: Basic service operations

2. CRITICAL INTERFACES:
   IRadarTarget: { id, position: {range, azimuth, elevation}, velocity: {radial, tangential}, signature: {rcs, classification}, timestamp, confidence }
   IRadarConfiguration: { frequency, power, beamWidth, pulseRepetitionRate, range: {min, max} }
   ITrackingResult: { targets, threats, systemStatus, interferenceLevel, coverage }
   IMissileGuidanceData: { targetCoordinates, currentPosition, velocity, timeToTarget }
   IGPSSignal: { satellites, accuracy, signalStrength, timestamp }
   INavigationResult: { courseCorrection, thrustVector, confidenceLevel, statusCode }

3. KEY DEFENSE FAILURE SCENARIOS:
   - GPS signal loss during missile guidance (critical phase)
   - Radar jamming and electronic countermeasures
   - Communication timeouts between systems
   - Sensor accuracy degradation under environmental stress
   - Power fluctuations affecting system performance
   - Anti-jamming protocol failures
   - Target classification errors (friend/foe identification)

ORIGINAL CODE TO ANALYZE:
${context.originalCode}

SYSTEM TYPE: ${context.functionType}
FUNCTION: ${context.functionName}

Generate 5-8 realistic semantic mutations focusing on:

1. **GPS/Navigation Failures**: Satellite loss, accuracy degradation, signal jamming
2. **Radar/Sensor Failures**: Interference, false targets, calibration drift  
3. **Communication Failures**: Timeouts, encryption errors, data corruption
4. **Power/Environmental**: Voltage drops, temperature effects, vibration
5. **Timing/Synchronization**: Clock drift, latency spikes, race conditions
6. **Security/Jamming**: Electronic warfare, spoofing, countermeasures

For each mutation, provide realistic failure simulation code that defense engineers would test.

RETURN ONLY A VALID JSON ARRAY - NO MARKDOWN, NO BACKTICKS, NO EXPLANATIONS:
[
  {
    "id": "semantic_mut_001",
    "description": "GPS signal degradation during missile guidance critical phase",
    "mutatedCode": "// realistic code simulating GPS signal loss with satellite count drop",
    "failureScenario": "GPS receiver loses 3+ satellites during terminal guidance phase",
    "riskLevel": "critical",
    "defenseSystemImpact": "Missile guidance switches to inertial navigation, reduced accuracy",
    "originalLine": 10,
    "mutatedLine": 10
  }
]

RETURN ONLY THE JSON ARRAY - NO OTHER TEXT.`;
  }

  private createDefenseTestPrompt(
    mutants: ISemanticMutant[],
    context: IMutationContext
  ): string {
    const mutantDescriptions = mutants
      .map((m) => `- ${m.description} (${m.riskLevel} risk)`)
      .join("\n");

    return `
You are a defense system test engineer. Generate a complete Jest test file for these realistic failure scenarios.

COMPLETE PROJECT CONTEXT:
This is a defense system with multiple services:

1. SERVICES AVAILABLE:
   - RadarTrackingService: Advanced radar system for target detection and tracking
   - MissileGuidanceService: Missile navigation and guidance system
   - HealthService: Simple health check service  
   - ExampleService: Basic example service

2. INTERFACES AVAILABLE:
   From IRadarTracking.ts:
   - IRadarTarget: { id, position: {range, azimuth, elevation}, velocity: {radial, tangential}, signature: {rcs, classification}, timestamp, confidence }
   - IRadarConfiguration: { frequency, power, beamWidth, pulseRepetitionRate, range: {min, max} }
   - ITrackingResult: { targets: IRadarTarget[], threats: IRadarTarget[], systemStatus: "OPERATIONAL"|"DEGRADED"|"OFFLINE"|"MAINTENANCE", interferenceLevel, coverage: {azimuthScan, elevationScan} }

   From IMissileGuidance.ts:
   - IMissileGuidanceData: { targetCoordinates: {lat, lng, alt}, currentPosition: {lat, lng, alt}, velocity: {x, y, z}, timeToTarget }
   - IGPSSignal: { satellites, accuracy, signalStrength, timestamp }
   - INavigationResult: { courseCorrection: {pitch, yaw, roll}, thrustVector: {magnitude, direction}, confidenceLevel, statusCode: "NOMINAL"|"DEGRADED"|"CRITICAL"|"ABORT" }

3. SERVICE METHODS:
   RadarTrackingService:
   - constructor(config: IRadarConfiguration)
   - processRadarReturns(rawReturns: any[]): ITrackingResult

   MissileGuidanceService:
   - calculateGuidanceVector(guidanceData: IMissileGuidanceData, gpsSignal: IGPSSignal): INavigationResult

   HealthService:
   - getHealth(): string (returns 'HEALTH OK')

   ExampleService:
   - postExample(value?: string): string (returns value or 'DEFAULT')

4. CORRECT IMPORT PATHS:
   - import { RadarTrackingService } from './radarTrackingService';
   - import { MissileGuidanceService } from './missileGuidanceService';
   - import { HealthService } from './healthService';
   - import { ExampleService } from './exampleService';
   - import { IRadarConfiguration, ITrackingResult, IRadarTarget } from './interfaces/IRadarTracking';
   - import { IMissileGuidanceData, IGPSSignal, INavigationResult } from './interfaces/IMissileGuidance';

SYSTEM TYPE: ${context.functionType}
ORIGINAL FUNCTION: ${context.functionName}

FAILURE SCENARIOS TO TEST:
${mutantDescriptions}

ORIGINAL CODE:
${context.originalCode}

REQUIREMENTS:
1. Generate ONLY valid TypeScript Jest test code - NO markdown wrappers or backticks
2. Use correct import paths as shown above
3. Import actual interfaces from their correct locations  
4. Generate exactly 2-3 focused test cases that will actually pass
5. Use proper TypeScript types throughout
6. Mock dependencies appropriately with jest.fn()
7. Test realistic defense system scenarios
8. Create proper mock data that matches the interfaces exactly
9. Use the actual method signatures as defined above

GENERATE ONLY THE TYPESCRIPT CODE - NO EXPLANATIONS, NO MARKDOWN, NO BACKTICKS.
Start with imports and end with the closing brace of the describe block.
Make sure all imports resolve correctly and all types are properly used.`;
  }

  private createAnalysisPrompt(code: string): string {
    return `
Analyze this TypeScript code to determine its defense system context and characteristics:

${code}

Determine:
1. Function type: sensor, communication, navigation, weapon, power, control, or generic
2. Main function names
3. Dependencies and imports
4. Potential failure points
5. Defense system relevance

RETURN ONLY A VALID JSON OBJECT - NO MARKDOWN, NO BACKTICKS, NO EXPLANATIONS:
{
  "functionType": "sensor",
  "functionName": "primary function name",
  "dependencies": ["list", "of", "dependencies"],
  "defenseRelevance": "explanation of how this relates to defense systems",
  "failurePoints": ["potential", "failure", "scenarios"]
}

RETURN ONLY THE JSON OBJECT - NO OTHER TEXT.`;
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
