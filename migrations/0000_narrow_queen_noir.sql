CREATE TABLE "user" (
	"name" text NOT NULL,
	"email" text NOT NULL,
	"user_id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"location" text,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
