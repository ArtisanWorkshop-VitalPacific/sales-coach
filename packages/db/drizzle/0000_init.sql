CREATE TYPE "public"."decision" AS ENUM('yes', 'later', 'no');--> statement-breakpoint
CREATE TYPE "public"."person_role" AS ENUM('tech', 'manager', 'owner');--> statement-breakpoint
CREATE TYPE "public"."session_kind" AS ENUM('full', 'drill', 'exam', 'rehearsal');--> statement-breakpoint
CREATE TYPE "public"."tier" AS ENUM('core', 'pro', 'elite', 'enterprise');--> statement-breakpoint
CREATE TABLE "assignments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"assigned_by_id" uuid,
	"assignee_id" uuid NOT NULL,
	"drill_id" text,
	"scenario_id" text,
	"difficulty" integer,
	"note" text,
	"due_at" timestamp with time zone,
	"completed_session_id" text,
	"completed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "assignments_target" CHECK ("assignments"."drill_id" is not null or "assignments"."scenario_id" is not null)
);
--> statement-breakpoint
CREATE TABLE "companies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"tier" "tier" DEFAULT 'core' NOT NULL,
	"trucks" integer DEFAULT 1 NOT NULL,
	"content_company_id" text,
	"stripe_customer_id" text,
	"stripe_subscription_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "companies_slug_unique" UNIQUE("slug"),
	CONSTRAINT "companies_stripe_customer_id_unique" UNIQUE("stripe_customer_id"),
	CONSTRAINT "companies_stripe_subscription_id_unique" UNIQUE("stripe_subscription_id")
);
--> statement-breakpoint
CREATE TABLE "content_overrides" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"version" integer NOT NULL,
	"objection_answers" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"scripts" jsonb DEFAULT '{"preferred":[],"banned":[]}'::jsonb NOT NULL,
	"price_ranges" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_by_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "people" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"clerk_user_id" text,
	"name" text NOT NULL,
	"role" "person_role" DEFAULT 'tech' NOT NULL,
	"servicetitan_technician_id" text,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "people_clerk_user_id_unique" UNIQUE("clerk_user_id")
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"company_id" uuid NOT NULL,
	"person_id" uuid NOT NULL,
	"scenario_id" text NOT NULL,
	"persona_id" text NOT NULL,
	"drill_id" text,
	"kind" "session_kind" DEFAULT 'full' NOT NULL,
	"difficulty" integer NOT NULL,
	"duration_ms" integer DEFAULT 0 NOT NULL,
	"decision" "decision",
	"overall_score" integer,
	"passed" boolean,
	"record" jsonb NOT NULL,
	"debrief" jsonb,
	"content_version" text NOT NULL,
	"adapters" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "sessions_difficulty_range" CHECK ("sessions"."difficulty" between 1 and 5),
	CONSTRAINT "sessions_score_range" CHECK ("sessions"."overall_score" is null or "sessions"."overall_score" between 0 and 100)
);
--> statement-breakpoint
CREATE TABLE "usage" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"month" text NOT NULL,
	"practice_minutes" double precision DEFAULT 0 NOT NULL,
	"voice_minutes" double precision DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "usage_month_format" CHECK ("usage"."month" ~ '^[0-9]{4}-[0-9]{2}$')
);
--> statement-breakpoint
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_assigned_by_id_people_id_fk" FOREIGN KEY ("assigned_by_id") REFERENCES "public"."people"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_assignee_id_people_id_fk" FOREIGN KEY ("assignee_id") REFERENCES "public"."people"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_completed_session_id_sessions_id_fk" FOREIGN KEY ("completed_session_id") REFERENCES "public"."sessions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_overrides" ADD CONSTRAINT "content_overrides_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_overrides" ADD CONSTRAINT "content_overrides_created_by_id_people_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."people"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "people" ADD CONSTRAINT "people_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_person_id_people_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."people"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "usage" ADD CONSTRAINT "usage_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "assignments_company_created_idx" ON "assignments" USING btree ("company_id","created_at");--> statement-breakpoint
CREATE INDEX "assignments_assignee_due_idx" ON "assignments" USING btree ("assignee_id","due_at");--> statement-breakpoint
CREATE UNIQUE INDEX "content_overrides_company_version_idx" ON "content_overrides" USING btree ("company_id","version");--> statement-breakpoint
CREATE INDEX "content_overrides_company_created_idx" ON "content_overrides" USING btree ("company_id","created_at");--> statement-breakpoint
CREATE INDEX "people_company_created_idx" ON "people" USING btree ("company_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "people_company_st_tech_idx" ON "people" USING btree ("company_id","servicetitan_technician_id");--> statement-breakpoint
CREATE INDEX "sessions_company_created_idx" ON "sessions" USING btree ("company_id","created_at");--> statement-breakpoint
CREATE INDEX "sessions_person_created_idx" ON "sessions" USING btree ("person_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "usage_company_month_idx" ON "usage" USING btree ("company_id","month");--> statement-breakpoint
CREATE INDEX "usage_company_created_idx" ON "usage" USING btree ("company_id","created_at");