ALTER TABLE "type_promotions" ALTER COLUMN "type" SET DEFAULT 'CUSTOM';--> statement-breakpoint
ALTER TABLE "promotions" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "promotion_actions" ADD COLUMN "configuration" jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "promotion_conditions" ADD COLUMN "configuration" jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "type_promotions" ADD COLUMN "description" text NOT NULL;