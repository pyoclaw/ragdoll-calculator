/**
 * Drizzle ORM schema for Ragdoll breeder database
 * Stores saved crosses, breeding plans, and genetic records
 */

import { pgTable, text, uuid, timestamp, numeric, json, boolean } from "drizzle-orm/pg-core";

/**
 * Users table - stores breeder/user information
 */
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  name: text("name"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

/**
 * Cats table - stores registered cats with their genetics
 */
export const cats = pgTable("cats", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  sex: text("sex").notNull(), // "male" or "female"
  registrationNumber: text("registration_number"),
  // Genotype stored as JSON for flexibility
  genotype: json("genotype").notNull(),
  // Phenotype cache for quick lookups
  colorPhenotype: text("color_phenotype"),
  patternPhenotype: text("pattern_phenotype"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

/**
 * Crosses table - stores planned and actual breeding crosses
 */
export const crosses = pgTable("crosses", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  parent1Id: uuid("parent1_id").notNull().references(() => cats.id, { onDelete: "restrict" }),
  parent2Id: uuid("parent2_id").notNull().references(() => cats.id, { onDelete: "restrict" }),
  plannedDate: timestamp("planned_date"),
  actualDate: timestamp("actual_date"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

/**
 * Litters table - stores information about actual litters
 */
export const litters = pgTable("litters", {
  id: uuid("id").primaryKey().defaultRandom(),
  crossId: uuid("cross_id").notNull().references(() => crosses.id, { onDelete: "cascade" }),
  litterSize: numeric("litter_size", { scale: 0 }),
  birthDate: timestamp("birth_date"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

/**
 * Genetic calculations table - caches results for reference
 */
export const calculations = pgTable("calculations", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  parent1Genotype: json("parent1_genotype").notNull(),
  parent2Genotype: json("parent2_genotype").notNull(),
  results: json("results").notNull(), // Array of OffspringProbability
  isPublic: boolean("is_public").default(false), // Whether to share in public database
  createdAt: timestamp("created_at").defaultNow(),
});

/**
 * Breeding records table - comprehensive history of actual litter outcomes
 */
export const breedingRecords = pgTable("breeding_records", {
  id: uuid("id").primaryKey().defaultRandom(),
  litterId: uuid("litter_id").notNull().references(() => litters.id, { onDelete: "cascade" }),
  kitten: text("kitten_name"),
  phenotype: json("phenotype").notNull(), // { color, pattern, overlay, sex }
  registrationNumber: text("registration_number"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Export types for use in the application
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export type Cat = typeof cats.$inferSelect;
export type InsertCat = typeof cats.$inferInsert;

export type Cross = typeof crosses.$inferSelect;
export type InsertCross = typeof crosses.$inferInsert;

export type Litter = typeof litters.$inferSelect;
export type InsertLitter = typeof litters.$inferInsert;

export type Calculation = typeof calculations.$inferSelect;
export type InsertCalculation = typeof calculations.$inferInsert;

export type BreedingRecord = typeof breedingRecords.$inferSelect;
export type InsertBreedingRecord = typeof breedingRecords.$inferInsert;
