import { HttpError } from '../errors/http-error';
import { mockMemberId } from '../mock/member';
import { mockProducts } from '../mock/products';
import type { CalculatedItems, CalculationInput, CalculationItem, CalculationResult } from '../models/calculation.model';

export class CalculatorService {
  calculate(_input: CalculationInput): CalculationResult | Promise<CalculationResult> {
    const memberId = _input.memberId;
    const items: CalculationItem[] = _input.items;
    let itemsCalculation: CalculatedItems[] = [];

    items.map((item) => {
      const code = item.code;
      const quantity = item.quantity;
      const product = mockProducts.find((p) => p.code === code);
      if (!product) throw new HttpError(400, `Product with code ${code} not found`);

      const itemCalculated: CalculatedItems = {
        code: code,
        quantity: quantity,
        price: product.price,
        subtotal: this.calculatePrice(product.price, quantity),
        discount: product.bundleDiscount ? this.bundleDiscountAmount(product.price, quantity, product.bundleDiscount?.quantity, product.bundleDiscount?.percent / 100) : 0,
        itemTotal: product.bundleDiscount
          ? this.calculateBundleDiscount(
              product.price,
              quantity,
              product.bundleDiscount.quantity,
              product.bundleDiscount.percent / 100,
            ) : this.calculatePrice(product.price, quantity),
      };
      itemsCalculation.push(itemCalculated);
    });

    const subtotal = this.getSubtotal(itemsCalculation);
    const bundleDiscount = this.getTotalDiscount(itemsCalculation);
    const itemTotal = this.getItemTotal(itemsCalculation);
    const memberDiscount = this.getMemberDiscountAmount(
      itemsCalculation,
      memberId,
    );

    const total = itemTotal - memberDiscount;

    const result: CalculationResult = {
      summary: {
        items: itemsCalculation,
        subtotal,
        bundleDiscount,
        memberDiscount,
        total,
      },
    };

    return result;
  }

  private bundleDiscountAmount(price: number, quantity: number, minBundleQuantity: number, discount: number): number {
    const bundleQty = Math.floor(quantity / minBundleQuantity) * minBundleQuantity;
    const bundleDiscount = bundleQty * price * discount;
    return bundleDiscount;
  }

  private calculateBundleDiscount(price: number, quantity: number, minBundleQuantity: number, discount: number): number {
    return this.calculatePrice(price, quantity) - this.bundleDiscountAmount(price, quantity, minBundleQuantity, discount);
  }

  private calculatePrice(price: number, quantity: number): number {
    return price * quantity;
  }

  private getSubtotal(items: CalculatedItems[]): number {
    return items.reduce((acc, item) => acc + item.subtotal, 0);
  }

  private getTotalDiscount(items: CalculatedItems[]): number {
    return items.reduce((acc, item) => acc + item.discount, 0);
  }

  private getMemberDiscount(memberId: string): number {
    if (memberId === mockMemberId) return 0.1;
    return 0;
  }

  private getItemTotal(items: CalculatedItems[]): number {
    return items.reduce((acc, item) => acc + item.itemTotal, 0);
  }

  private getMemberDiscountAmount(items: CalculatedItems[], memberId: string): number {
    const memberDiscount = this.getMemberDiscount(memberId);
    const itemTotal = this.getItemTotal(items);
    const memberDiscountAmount = itemTotal * memberDiscount;
    return memberDiscountAmount;
  }
}
