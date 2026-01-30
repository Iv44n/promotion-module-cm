export interface TargetCategoryConfig {
  categoryId: string;
}
export interface MinAmountConfig {
  amount: number;
}
export type ConditionConfig = TargetCategoryConfig | MinAmountConfig;
