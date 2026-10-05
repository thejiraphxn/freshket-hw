import type { CalculationResult } from '../models/calculation.model';

export interface CalculateSuccessView {
  success: true;
  data: CalculationResult;
}

export function renderCalculation(result: CalculationResult): CalculateSuccessView {
  return { success: true, data: result };
}
