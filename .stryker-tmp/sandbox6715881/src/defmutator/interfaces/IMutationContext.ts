// @ts-nocheck
export interface IMutationContext {
    filePath: string;
    originalCode: string;
    functionName: string;
    functionType: 'sensor' | 'communication' | 'navigation' | 'weapon' | 'power' | 'control' | 'generic';
    dependencies: string[];
    testFilePath?: string;
}
