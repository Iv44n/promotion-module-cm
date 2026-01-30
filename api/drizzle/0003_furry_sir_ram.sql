ALTER TABLE "type_promotions" ALTER COLUMN "type" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "promotions" ALTER COLUMN "promotion_type" DROP NOT NULL;