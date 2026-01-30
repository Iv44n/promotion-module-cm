CREATE TYPE "public"."promotion_actions_types" AS ENUM('PERCENTAGE_DISCOUNT', 'FIXED_DISCOUNT');--> statement-breakpoint
CREATE TYPE "public"."promotion_conditions_types" AS ENUM('TARGET_CATEGORY', 'MIN_AMOUNT');--> statement-breakpoint
CREATE TABLE "promotion_actions" (
	"id" serial PRIMARY KEY NOT NULL,
	"promotion_id" uuid NOT NULL,
	"action_type" "promotion_actions_types" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "promotion_conditions" (
	"id" serial PRIMARY KEY NOT NULL,
	"promotion_id" uuid NOT NULL,
	"condition_type" "promotion_conditions_types" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "type_promotions" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"action_type" "promotion_actions_types" NOT NULL,
	"condition_type" "promotion_conditions_types" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "promotions" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"promotion_type" integer NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
ALTER TABLE "promotion_actions" ADD CONSTRAINT "promotion_actions_promotion_id_promotions_id_fk" FOREIGN KEY ("promotion_id") REFERENCES "public"."promotions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "promotion_conditions" ADD CONSTRAINT "promotion_conditions_promotion_id_promotions_id_fk" FOREIGN KEY ("promotion_id") REFERENCES "public"."promotions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "promotions" ADD CONSTRAINT "promotions_promotion_type_type_promotions_id_fk" FOREIGN KEY ("promotion_type") REFERENCES "public"."type_promotions"("id") ON DELETE no action ON UPDATE no action;