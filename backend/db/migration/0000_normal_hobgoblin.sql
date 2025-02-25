CREATE TABLE "drug" (
	"drug_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"code" varchar(255) NOT NULL,
	"drug_type" varchar(255) NOT NULL,
	"detail" text,
	"usage" varchar(255),
	"slang_food" text,
	"side_effect" text,
	"unit_type" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp (3)
);
--> statement-breakpoint
CREATE TABLE "stock" (
	"stock_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"drug_id" uuid,
	"unit_price" real,
	"amount" integer NOT NULL,
	"expired" date,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp (3)
);
--> statement-breakpoint
ALTER TABLE "stock" ADD CONSTRAINT "stock_drug_id_drug_drug_id_fk" FOREIGN KEY ("drug_id") REFERENCES "public"."drug"("drug_id") ON DELETE cascade ON UPDATE no action;