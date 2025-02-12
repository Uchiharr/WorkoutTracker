import { type Workout, type Exercise, type WorkoutHistory, type InsertWorkout, type InsertExercise, type InsertHistory } from "@shared/schema";

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
}

export class MemStorage implements IStorage {
  private workouts: Map<number, Workout>;
  private exercises: Map<number, Exercise>;
  private history: Map<number, WorkoutHistory>;
  private currentWorkoutId: number;
  private currentExerciseId: number;
  private currentHistoryId: number;

  constructor() {
    this.workouts = new Map();
    this.exercises = new Map();
    this.history = new Map();
    this.currentWorkoutId = 1;
    this.currentExerciseId = 1;
    this.currentHistoryId = 1;
  }

  async createWorkout(workout: InsertWorkout): Promise<Workout> {
    const id = this.currentWorkoutId++;
    const newWorkout = { ...workout, id };
    this.workouts.set(id, newWorkout);
    return newWorkout;
  }

  async getWorkout(id: number): Promise<Workout | undefined> {
    return this.workouts.get(id);
  }

  async listWorkouts(): Promise<Workout[]> {
    return Array.from(this.workouts.values());
  }

  async createExercise(exercise: InsertExercise): Promise<Exercise> {
    const id = this.currentExerciseId++;
    const newExercise = { ...exercise, id };
    this.exercises.set(id, newExercise);
    return newExercise;
  }

  async getExercisesForWorkout(workoutId: number): Promise<Exercise[]> {
    return Array.from(this.exercises.values())
      .filter(e => e.workoutId === workoutId)
      .sort((a, b) => a.order - b.order);
  }

  async addHistory(history: InsertHistory): Promise<WorkoutHistory> {
    const id = this.currentHistoryId++;
    const newHistory = { ...history, id };
    this.history.set(id, newHistory);
    return newHistory;
  }

  async getHistoryForExercise(exerciseId: number): Promise<WorkoutHistory[]> {
    return Array.from(this.history.values())
      .filter(h => h.exerciseId === exerciseId)
      .sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime());
  }
}

export const storage = new MemStorage();
