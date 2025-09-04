// @ts-nocheck
import { IMutationContext } from './IMutationContext';
import { ISemanticMutant } from './ISemanticMutant';

export interface ILLMProvider {
    generateSemanticMutants(context: IMutationContext): Promise<ISemanticMutant[]>;
    generateDefenseTests(mutants: ISemanticMutant[], context: IMutationContext): Promise<string>;
    analyzeCodeForDefenseContext(code: string): Promise<IMutationContext>;
}
