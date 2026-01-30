ALTER TABLE "promotion_actions" DROP CONSTRAINT "promotion_actions_promotion_id_promotions_id_fk";
--> statement-breakpoint
ALTER TABLE "promotion_conditions" DROP CONSTRAINT "promotion_conditions_promotion_id_promotions_id_fk";
--> statement-breakpoint
ALTER TABLE "promotion_actions" ADD CONSTRAINT "promotion_actions_promotion_id_promotions_id_fk" FOREIGN KEY ("promotion_id") REFERENCES "public"."promotions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "promotion_conditions" ADD CONSTRAINT "promotion_conditions_promotion_id_promotions_id_fk" FOREIGN KEY ("promotion_id") REFERENCES "public"."promotions"("id") ON DELETE cascade ON UPDATE no action;