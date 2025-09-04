// @ts-nocheck
export interface IDefenseScenario {
    name: string;
    description: string;
    systemType: 'missile' | 'radar' | 'satellite' | 'drone' | 'naval' | 'ground' | 'cyber';
    failureTypes: string[];
    criticalConditions: string[];
    expectedBehaviors: string[];
}
