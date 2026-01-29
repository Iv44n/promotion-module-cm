export interface CartItem {
  productId: string;
  name: string;
  categoryId: string;
  price: number;
  quantity: number;
}

export interface Cart {
  id: string;
  items: CartItem[];
  subtotal: number;
  metadata?: Record<string, unknown>;
}

export interface AppliedDiscount {
  promotionId: string;
  promotionName: string;
  discountType: 'PERCENTAGE_DISCOUNT' | 'FIXED_DISCOUNT';
  discountAmount: number;
  description: string;
}
export interface PromotionResult {
  cart: Cart;
  appliedDiscounts: AppliedDiscount[];
  totalDiscount: number;
  finalTotal: number;
}
