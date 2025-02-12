import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import type { Exercise, WorkoutHistory } from "@shared/schema";

export default function WorkoutHistory({ params }: { params: { id: string } }) {
  const { data: exercises } = useQuery<Exercise[]>({
    queryKey: [`/api/workouts/${params.id}/exercises`]
  });

  const exerciseHistories = exercises?.map(exercise => {
    const { data: history } = useQuery<WorkoutHistory[]>({
      queryKey: [`/api/exercises/${exercise.id}/history`]
    });
    return { exercise, history };
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Workout History</h1>

      <div className="space-y-6">
        {exerciseHistories?.map(({ exercise, history }) => (
          <Card key={exercise.id} className="p-6">
            <h2 className="text-xl font-bold mb-4">{exercise.name}</h2>

            {!history?.length ? (
              <p className="text-muted-foreground">No history yet</p>
            ) : (
              <div className="space-y-2">
                {history.map((h) => (
                  <div key={h.id} className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                      {format(new Date(h.completedAt), "PPP")}
                    </div>
                    <div className="font-medium">
                      {h.weight} {h.unit}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}