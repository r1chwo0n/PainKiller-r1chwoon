CREATE TABLE "drug" (
	"drug_id" integer PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"detail" text,
	"usage" varchar(255),
	"slang_food" text,
	"side_effect" text,
	"unit_price" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp (3)
);
--> statement-breakpoint
CREATE TABLE "stock" (
	"stock_id" integer PRIMARY KEY NOT NULL,
	"drug_id" integer,
	"amount" integer NOT NULL,
	"expired" date,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp (3)
);
--> statement-breakpoint
ALTER TABLE "stock" ADD CONSTRAINT "stock_drug_id_drug_drug_id_fk" FOREIGN KEY ("drug_id") REFERENCES "public"."drug"("drug_id") ON DELETE no action ON UPDATE no action;