import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { Workout, Exercise, WorkoutHistory } from "@shared/schema";

export function RecentWorkouts() {
  const { data: workouts } = useQuery<Workout[]>({
    queryKey: ["/api/workouts"]
  });

  // For each workout, get its exercises and their history
  const workoutDetails = workouts?.slice(0, 5).map(workout => {
    const { data: exercises } = useQuery<Exercise[]>({
      queryKey: [`/api/workouts/${workout.id}/exercises`],
      enabled: !!workout
    });

    const exerciseHistories = exercises?.map(exercise => {
      const { data: history } = useQuery<WorkoutHistory[]>({
        queryKey: [`/api/exercises/${exercise.id}/history`],
        enabled: !!exercise
      });
      return { exercise, history };
    });

    return {
      workout,
      exerciseHistories
    };
  });

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Recent Workouts</h2>
      <div className="grid gap-4">
        {workoutDetails?.map(({ workout, exerciseHistories }) => {
          // Find the most recent history entry for this workout
          const latestDate = exerciseHistories?.reduce<string | null>((latest, { history }) => {
            const historyDate = history?.[0]?.completedAt;
            if (!historyDate) return latest;
            return !latest || new Date(historyDate) > new Date(latest) 
              ? historyDate.toString()
              : latest;
          }, null);

          if (!latestDate) return null;

          return (
            <Card key={workout.id} className="hover:bg-accent/5 transition-colors">
              <CardHeader className="pb-2">
                <CardTitle className="flex justify-between items-center">
                  <span>{workout.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {format(new Date(latestDate), "MMM d, yyyy")}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  {exerciseHistories?.map(({ exercise, history }) => {
                    const latestWeight = history?.[0];
                    if (!latestWeight) return null;

                    return (
                      <div key={exercise.id} className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">{exercise.name}</span>
                        <span>
                          {latestWeight.weight} {latestWeight.unit}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}