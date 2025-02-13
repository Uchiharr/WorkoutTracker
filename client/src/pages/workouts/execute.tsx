
import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useSettings } from "@/contexts/settings";
import { useMediaQuery } from "@/hooks/use-media-query";
import type { Exercise, WorkoutHistory } from "@shared/schema";

export default function ExecuteWorkout({ params }: { params: { id: string } }) {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { weightUnit } = useSettings();
  const [currentExercise, setCurrentExercise] = useState(0);
  const [weight, setWeight] = useState("");
  const isMobile = useMediaQuery("(max-width: 768px)");

  const { data: workout } = useQuery({
    queryKey: [`/api/workouts/${params.id}`]
  });

  const { data: exercises } = useQuery<Exercise[]>({
    queryKey: [`/api/workouts/${params.id}/exercises`]
  });

  const { data: history } = useQuery<WorkoutHistory[]>({
    queryKey: [`/api/exercises/${exercises?.[currentExercise]?.id}/history`],
    enabled: !!exercises?.[currentExercise]
  });

  const recordWeight = useMutation({
    mutationFn: async () => {
      const exercise = exercises![currentExercise];
      await apiRequest("POST", "/api/history", {
        workoutId: Number(params.id),
        exerciseId: exercise.id,
        weight: Number(weight),
        unit: weightUnit
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`/api/exercises/${exercises![currentExercise].id}/history`]
      });
      queryClient.invalidateQueries({ queryKey: ["/api/history/recent"] });

      if (currentExercise < exercises!.length - 1) {
        setCurrentExercise(currentExercise + 1);
        setWeight("");
      } else {
        toast({ 
          title: "Workout Complete!", 
          description: "Great job!",
          duration: 3000
        });
        navigate("/");
      }
    }
  });

  if (!workout || !exercises) {
    return <div>Loading...</div>;
  }

  const exercise = exercises[currentExercise];
  const lastWeight = history?.[0];

  const content = (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">{exercise.name}</h2>
        <p className="text-muted-foreground">
          {exercise.sets} sets × {exercise.reps} reps
        </p>
      </div>

      {lastWeight && (
        <div>
          <p className="text-sm text-muted-foreground">Last weight used:</p>
          <p className="text-xl font-medium">
            {lastWeight.weight} {lastWeight.unit}
          </p>
        </div>
      )}

      <div className="space-y-2">
        <p className="text-sm font-medium">Weight ({weightUnit})</p>
        <Input
          type="number"
          value={weight}
          onChange={e => setWeight(e.target.value)}
          placeholder="Enter weight"
        />
      </div>

      <div className="space-x-4">
        <Button
          onClick={() => recordWeight.mutate()}
          disabled={!weight || recordWeight.isPending}
        >
          {currentExercise === exercises.length - 1 ? "Complete Workout" : "Next Exercise"}
        </Button>
        <Button variant="outline" onClick={() => navigate("/")}>
          Cancel
        </Button>
      </div>

      <div className="text-sm text-muted-foreground">
        Exercise {currentExercise + 1} of {exercises.length}
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{workout.name}</h1>
      
      {isMobile ? (
        <Drawer>
          <DrawerContent className="p-6">
            {content}
          </DrawerContent>
        </Drawer>
      ) : (
        <Card className="p-6">
          {content}
        </Card>
      )}
    </div>
  );
}
