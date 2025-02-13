import { type Workout, type Exercise, type WorkoutHistory, type InsertWorkout, type InsertExercise, type InsertHistory } from "@shared/schema";
import { workouts, exercises, workoutHistory } from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql } from "drizzle-orm";

export interface IStorage {
  // Workouts
  createWorkout(workout: InsertWorkout): Promise<Workout>;
  getWorkout(id: number): Promise<Workout | undefined>;
  listWorkouts(): Promise<Workout[]>;

  // Exercises
  createExercise(exercise: InsertExercise): Promise<Exercise>;
  getExercisesForWorkout(workoutId: number): Promise<Exercise[]>;

  // History
  addHistory(history: InsertHistory): Promise<WorkoutHistory>;
  getHistoryForExercise(exerciseId: number): Promise<WorkoutHistory[]>;
  getRecentHistory(): Promise<{ id: number; workoutId: number; workoutName: string; completedAt: Date }[]>;
}

export class DatabaseStorage implements IStorage {
  async createWorkout(workout: InsertWorkout): Promise<Workout> {
    const [result] = await db.insert(workouts).values(workout).returning();
    return result;
  }

  async getWorkout(id: number): Promise<Workout | undefined> {
    const [result] = await db.select().from(workouts).where(eq(workouts.id, id));
    return result;
  }

  async listWorkouts(): Promise<Workout[]> {
    return db.select().from(workouts);
  }

  async createExercise(exercise: InsertExercise): Promise<Exercise> {
    const [result] = await db.insert(exercises).values(exercise).returning();
    return result;
  }

  async getExercisesForWorkout(workoutId: number): Promise<Exercise[]> {
    return db
      .select()
      .from(exercises)
      .where(eq(exercises.workoutId, workoutId))
      .orderBy(exercises.order);
  }

  async addHistory(history: InsertHistory): Promise<WorkoutHistory> {
    const [result] = await db
      .insert(workoutHistory)
      .values({
        ...history,
        completedAt: sql`CURRENT_TIMESTAMP`
      })
      .returning();
    return result;
  }

  async getHistoryForExercise(exerciseId: number): Promise<WorkoutHistory[]> {
    return db
      .select()
      .from(workoutHistory)
      .where(eq(workoutHistory.exerciseId, exerciseId))
      .orderBy(desc(workoutHistory.completedAt));
  }

  async getRecentHistory(): Promise<{ id: number; workoutId: number; workoutName: string; completedAt: Date }[]> {
    // First, get the latest completion time for each workout
    const latestWorkouts = await db
      .select({
        workoutId: workoutHistory.workoutId,
        latestCompletedAt: sql<string>`MAX(${workoutHistory.completedAt})`
      })
      .from(workoutHistory)
      .groupBy(workoutHistory.workoutId)
      .orderBy(desc(sql<string>`MAX(${workoutHistory.completedAt})`))
      .limit(5);

    // Then, get the full details for these latest workouts
    const recentWorkouts = [];
    for (const latest of latestWorkouts) {
      const [workout] = await db
        .select({
          id: workoutHistory.id,
          workoutId: workoutHistory.workoutId,
          workoutName: workouts.name,
          completedAt: workoutHistory.completedAt
        })
        .from(workoutHistory)
        .innerJoin(workouts, eq(workoutHistory.workoutId, workouts.id))
        .where(eq(workoutHistory.workoutId, latest.workoutId))
        .where(eq(workoutHistory.completedAt, new Date(latest.latestCompletedAt)))
        .limit(1);

      if (workout) {
        recentWorkouts.push(workout);
      }
    }

    return recentWorkouts;
  }
}

export const storage = new DatabaseStorage();