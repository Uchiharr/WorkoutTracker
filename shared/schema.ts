import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const workouts = pgTable("workouts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
});

export const exercises = pgTable("exercises", {
  id: serial("id").primaryKey(),
  workoutId: integer("workout_id").notNull(),
  name: text("name").notNull(),
  sets: integer("sets").notNull(),
  reps: integer("reps").notNull(),
  order: integer("order").notNull(),
});

export const workoutHistory = pgTable("workout_history", {
  id: serial("id").primaryKey(),
  workoutId: integer("workout_id").notNull(),
  exerciseId: integer("exercise_id").notNull(),
  weight: integer("weight").notNull(),
  completedAt: timestamp("completed_at").notNull(),
});

export const insertWorkoutSchema = createInsertSchema(workouts);
export const insertExerciseSchema = createInsertSchema(exercises).omit({ id: true });
export const insertHistorySchema = createInsertSchema(workoutHistory).omit({ id: true });

export type Workout = typeof workouts.$inferSelect;
export type Exercise = typeof exercises.$inferSelect;
export type WorkoutHistory = typeof workoutHistory.$inferSelect;
export type InsertWorkout = z.infer<typeof insertWorkoutSchema>;
export type InsertExercise = z.infer<typeof insertExerciseSchema>;
export type InsertHistory = z.infer<typeof insertHistorySchema>;
