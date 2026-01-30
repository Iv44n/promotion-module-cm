export interface PercentageDiscountConfig {
  discountPercentage: number;
}

export interface FixedDiscountConfig {
  discountFixed: number;
}

export type ActionConfig = PercentageDiscountConfig | FixedDiscountConfig;
