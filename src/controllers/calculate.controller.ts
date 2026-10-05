import type { Request, Response } from 'express';
import { parseCalculationInput } from '../models/calculation.model';
import { CalculatorService } from '../services/calculator.service';
import { renderCalculation } from '../views/calculate.view';

export class CalculateController {
  constructor(private readonly calculator: CalculatorService) {}

  // Express 5 forwards thrown errors / rejected promises to the error handler.
  calculate = async (req: Request, res: Response): Promise<void> => {
    const input = parseCalculationInput(req.body);
    const result = await this.calculator.calculate(input);
    res.status(200).json(renderCalculation(result));
  };
}
