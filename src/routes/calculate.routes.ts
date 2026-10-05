import { Router } from 'express';
import { CalculateController } from '../controllers/calculate.controller';
import { CalculatorService } from '../services/calculator.service';

const router = Router();
const controller = new CalculateController(new CalculatorService());

router.post('/calculate', controller.calculate);

// Ex: POST /calculate
// {
//   "memberId": "123456789",
//   "items": [
//     {
//       "code": "ORANGE",
//       "quantity": 2
//     }
//   ]
// }

export default router;
