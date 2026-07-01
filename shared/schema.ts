import { pgTable, text, serial, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  company: text("company").notNull(),
  role: text("role").notNull(),
  companySize: text("company_size").notNull(),
  aiUsage: jsonb("ai_usage").$type<string[]>().default([]),
  useCase: text("use_case"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertLeadSchema = createInsertSchema(leads).omit({
  id: true,
  createdAt: true,
}).extend({
  aiUsage: z.array(z.string()).optional(),
});

export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Lead = typeof leads.$inferSelect;

// Customer reviews / testimonials submitted from /review. Held as
// `status: "pending"` until manually approved for public/marketing use.
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  jobTitle: text("job_title").notNull(),
  company: text("company"),
  email: text("email").notNull(),
  // Credibility checkboxes ("Deployed it in our environment", "Saw a live demo", …)
  experience: jsonb("experience").$type<string[]>().default([]),
  review: text("review").notNull(),
  // Marketing-use release acceptance (must be true to submit).
  consent: boolean("consent").notNull().default(false),
  // Moderation gate — nothing is shown publicly until set to "approved".
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertReviewSchema = createInsertSchema(reviews)
  .omit({
    id: true,
    createdAt: true,
    status: true,
  })
  .extend({
    name: z.string().trim().min(1, "Please enter your name."),
    jobTitle: z.string().trim().min(1, "Please enter your job title."),
    company: z.string().trim().max(120).optional(),
    email: z.string().trim().email("Please enter a valid email address."),
    experience: z.array(z.string()).optional(),
    review: z
      .string()
      .trim()
      .min(75, "Please write at least 75 characters so the review is useful.")
      .max(1500, "Please keep your review under 1500 characters."),
    consent: z.boolean().refine((v) => v === true, {
      message: "Please accept the review terms to submit.",
    }),
  });

export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof reviews.$inferSelect;

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
