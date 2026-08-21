ALTER TABLE "poll" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "vote" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();