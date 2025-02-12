import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { ExerciseForm } from "@/components/workouts/exercise-form";
import { insertWorkoutSchema, insertExerciseSchema, type InsertWorkout, type Exercise } from "@shared/schema";

export default function CreateWorkout() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [exercises, setExercises] = useState<Omit<Exercise, "id">[]>([]);
  
  const form = useForm<InsertWorkout>({
    resolver: zodResolver(insertWorkoutSchema),
    defaultValues: { name: "" }
  });

  const createWorkout = useMutation({
    mutationFn: async (data: InsertWorkout) => {
      const workout = await apiRequest("POST", "/api/workouts", data)
        .then(r => r.json());
      
      // Create exercises
      for (const exercise of exercises) {
        await apiRequest("POST", `/api/workouts/${workout.id}/exercises`, exercise);
      }
      
      return workout;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workouts"] });
      toast({ title: "Success", description: "Workout created successfully" });
      navigate("/");
    }
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Create Workout</h1>

      <Card className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(data => createWorkout.mutate(data))}>
            <div className="space-y-4">
              <div>
                <Input
                  placeholder="Workout Name"
                  {...form.register("name")}
                />
              </div>

              <div className="space-y-4">
                {exercises.map((exercise, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="flex-1">
                      <p className="font-medium">{exercise.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {exercise.sets} sets × {exercise.reps} reps
                      </p>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setExercises(exercises.filter((_, i) => i !== index))}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>

              <ExerciseForm
                onSubmit={(data) => {
                  setExercises([...exercises, { ...data, workoutId: 0, order: exercises.length }]);
                }}
              />

              <div className="pt-4 space-x-4">
                <Button
                  type="submit"
                  disabled={exercises.length === 0 || createWorkout.isPending}
                >
                  Create Workout
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/")}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
}
