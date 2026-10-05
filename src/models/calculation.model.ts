import { HttpError } from '../errors/http-error';

/**
 * Request body of POST /calculate.
 * TODO: replace with the fields your Calculator service needs.
 */
export type CalculationInput = {
  memberId: string;
  items: CalculationItem[];
};

export type CalculatedItems = {
  code: string;
  quantity: number;
  price: number;
  subtotal: number;
  discount: number;
  itemTotal: number;
};

export type CalculationItem = {
  code: string;
  quantity: number;
};

export type CalculationResult = {
  summary: {
    items: CalculatedItems[];
    subtotal: number;
    memberDiscount: number;
    bundleDiscount: number;
    total: number;
  };
};

export function parseCalculationInput(body: unknown): CalculationInput {
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    throw new HttpError(400, 'Request body must be a JSON object');
  }
  return body as CalculationInput;
}
