CREATE TABLE "tasks" (
	"id" serial PRIMARY KEY NOT NULL,
	"text" text NOT NULL,
	"date" date NOT NULL,
	"time" text NOT NULL,
	"completed" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
