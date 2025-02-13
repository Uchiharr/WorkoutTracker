import { Link } from "wouter";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Edit, Trash } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Workout } from "@shared/schema";

type WorkoutCardProps = {
  workout: Workout;
};

export function WorkoutCard({ workout }: WorkoutCardProps) {
  const { toast } = useToast();

  const deleteWorkout = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", `/api/workouts/${workout.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workouts"] });
      toast({ 
        title: "Success", 
        description: "Workout deleted successfully",
        duration: 3000
      });
    }
  });

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="text-center">
        <CardTitle className="mx-auto">{workout.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="grid grid-cols-3 gap-2">
          <Link href={`/workouts/${workout.id}/execute`}>
            <Button variant="default" className="w-full">
              <Play className="w-4 h-4 mr-2" />
              Start
            </Button>
          </Link>
          <Link href={`/workouts/${workout.id}/edit`}>
            <Button variant="outline" className="w-full">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </Link>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => {
              if (confirm("Are you sure you want to delete this workout?")) {
                deleteWorkout.mutate();
              }
            }}
          >
            <Trash className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}