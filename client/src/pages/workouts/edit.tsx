import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
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

export default function EditWorkout({ params }: { params: { id: string } }) {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [exercises, setExercises] = useState<Omit<Exercise, "id">[]>([]);
  const [editingExerciseIndex, setEditingExerciseIndex] = useState<number | null>(null);

  const { data: workout } = useQuery({
    queryKey: [`/api/workouts/${params.id}`]
  });

  const { data: existingExercises } = useQuery<Exercise[]>({
    queryKey: [`/api/workouts/${params.id}/exercises`]
  });

  const form = useForm<InsertWorkout>({
    resolver: zodResolver(insertWorkoutSchema),
    values: workout
  });

  useEffect(() => {
    if (existingExercises) {
      setExercises(existingExercises.map(({ id, ...rest }) => rest));
    }
  }, [existingExercises]);

  const updateWorkout = useMutation({
    mutationFn: async (data: InsertWorkout) => {
      const workout = await apiRequest("PATCH", `/api/workouts/${params.id}`, data)
        .then(r => r.json());

      // Delete existing exercises
      await apiRequest("DELETE", `/api/workouts/${params.id}/exercises`);

      // Create new exercises
      for (const exercise of exercises) {
        await apiRequest("POST", `/api/workouts/${params.id}/exercises`, exercise);
      }

      return workout;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workouts"] });
      toast({ 
        title: "Success", 
        description: "Workout updated successfully",
        duration: 3000
      });
      navigate("/");
    }
  });

  const deleteWorkout = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", `/api/workouts/${params.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workouts"] });
      toast({ 
        title: "Success", 
        description: "Workout deleted successfully",
        duration: 3000
      });
      navigate("/");
    }
  });

  if (!workout || !existingExercises) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Edit Workout</h1>

      <Card className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(data => updateWorkout.mutate(data))}>
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
                    {editingExerciseIndex === index ? (
                      <div className="flex-1">
                        <ExerciseForm
                          defaultValues={exercise}
                          onSubmit={(data) => {
                            const updatedExercises = [...exercises];
                            updatedExercises[index] = { ...data, workoutId: Number(params.id), order: index };
                            setExercises(updatedExercises);
                            setEditingExerciseIndex(null);
                          }}
                          onCancel={() => setEditingExerciseIndex(null)}
                        />
                      </div>
                    ) : (
                      <>
                        <div className="flex-1">
                          <p className="font-medium">{exercise.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {exercise.sets} sets × {exercise.reps} reps
                          </p>
                        </div>
                        <div className="space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingExerciseIndex(index)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setExercises(exercises.filter((_, i) => i !== index))}
                          >
                            Remove
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>

              {editingExerciseIndex === null && (
                <ExerciseForm
                  onSubmit={(data) => {
                    setExercises([...exercises, { ...data, workoutId: Number(params.id), order: exercises.length }]);
                  }}
                />
              )}

              <div className="pt-4 flex justify-between items-center">
                <div className="space-x-4">
                  <Button
                    type="submit"
                    disabled={exercises.length === 0 || updateWorkout.isPending}
                  >
                    Update Workout
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/")}
                  >
                    Cancel
                  </Button>
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => {
                    if (confirm("Are you sure you want to delete this workout?")) {
                      deleteWorkout.mutate();
                    }
                  }}
                >
                  Delete Workout
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
}