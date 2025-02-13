import { Link } from "wouter";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Edit, Trash } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Workout } from "@shared/schema";
import { useMediaQuery } from "@/hooks/use-media-query";


type WorkoutCardProps = {
  workout: Workout;
};

export function WorkoutCard({ workout }: WorkoutCardProps) {
  const { toast } = useToast();
  const isMobile = useMediaQuery("(max-width: 768px)");

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
    <div className={`${isMobile ? "flex flex-col" : "flex flex-col h-full"}`}> {/* Added conditional class for mobile */}
      {isMobile ? ( // Mobile view: Bottom drawer
        <div className="fixed bottom-0 left-0 w-full bg-white">
          <div className="p-4">
            <div className="flex flex-col gap-2">
              <Link href={`/workouts/${workout.id}/execute`}>
                <Button variant="default" size="lg"> {/* Increased button size */}
                  <Play className="w-6 h-6 mr-2" /> {/* Increased icon size */}
                  Start
                </Button>
              </Link>
              <Link href={`/workouts/${workout.id}/edit`}>
                <Button variant="outline" size="lg"> {/* Increased button size */}
                  <Edit className="w-6 h-6 mr-2" /> {/* Increased icon size */}
                  Edit
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="lg" /* Increased button size */
                onClick={() => {
                  if (confirm("Are you sure you want to delete this workout?")) {
                    deleteWorkout.mutate();
                  }
                }}
              >
                <Trash className="w-6 h-6 mr-2" /> {/* Increased icon size */}
                Delete
              </Button>
            </div>
          </div>
        </div>
      ) : ( // Desktop view: Card
        <Card className="flex flex-col h-full">
          <CardHeader className="text-center">
            <CardTitle className="mx-auto">{workout.name}</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="grid grid-cols-3 gap-2">
              <Link href={`/workouts/${workout.id}/execute`}>
                <Button variant="default" size="icon">
                  <Play className="w-4 h-4 mr-2" />
                  Start
                </Button>
              </Link>
              <Link href={`/workouts/${workout.id}/edit`}>
                <Button variant="outline" size="icon">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="icon"
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
      )}
      <div className={`${isMobile ? "flex flex-col" : ""}`}> {/* Added conditional class for mobile */}
        {/* Workout name and details would go here, possibly adjusting for mobile */}
        <p>{workout.description}</p> {/* Example: Adding description */}

      </div>
    </div>
  );
}