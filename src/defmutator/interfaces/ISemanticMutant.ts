export interface ISemanticMutant {
  id: string;
  description: string;
  mutatedCode: string;
  failureScenario: string;
  riskLevel: "low" | "medium" | "high" | "critical";
  defenseSystemImpact: string;
  originalLine: number;
  mutatedLine: number;
}
