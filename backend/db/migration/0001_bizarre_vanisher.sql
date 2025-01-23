ALTER TABLE "stock" DROP CONSTRAINT "stock_drug_id_drug_drug_id_fk";
--> statement-breakpoint
ALTER TABLE "drug" ALTER COLUMN "drug_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "drug" ALTER COLUMN "drug_id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "drug" ALTER COLUMN "unit_price" SET DATA TYPE real;--> statement-breakpoint
ALTER TABLE "stock" ALTER COLUMN "stock_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "stock" ALTER COLUMN "stock_id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "stock" ALTER COLUMN "drug_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "drug" ADD COLUMN "code" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "stock" ADD CONSTRAINT "stock_drug_id_drug_drug_id_fk" FOREIGN KEY ("drug_id") REFERENCES "public"."drug"("drug_id") ON DELETE cascade ON UPDATE no action;