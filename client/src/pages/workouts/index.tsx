import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, History, Download, Upload } from "lucide-react";
import { WorkoutCard } from "@/components/workouts/workout-card";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import type { Workout } from "@shared/schema";

type RecentWorkout = {
  id: number;
  workoutId: number;
  workoutName: string;
  completedAt: string;
};

export default function WorkoutList() {
  const { toast } = useToast();
  const { data: workouts, isLoading } = useQuery<Workout[]>({
    queryKey: ["/api/workouts"]
  });

  const { data: recentHistory } = useQuery<RecentWorkout[]>({
    queryKey: ["/api/history/recent"]
  });

  const handleExport = async () => {
    try {
      const response = await fetch('/api/export');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'workout-data.json';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast({
        title: "Success",
        description: "Workouts exported successfully",
        duration: 3000
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export workouts",
        variant: "destructive",
        duration: 3000
      });
    }
  };

  const handleImport = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const text = await file.text();
        const data = JSON.parse(text);
        await fetch('/api/import', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        toast({
          title: "Success",
          description: "Workouts imported successfully",
          duration: 3000
        });
        window.location.reload();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to import workouts",
          variant: "destructive",
          duration: 3000
        });
      }
    };
    input.click();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Workouts</h1>
        <div className="flex gap-2">
          <Button onClick={handleImport}>
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Link href="/workouts/create">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Workout
            </Button>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[1, 2, 3].map(i => (
            <Card key={i} className="h-48 animate-pulse" />
          ))}
        </div>
      ) : workouts?.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No workouts yet. Create your first one!</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {workouts?.map(workout => (
            <WorkoutCard key={workout.id} workout={workout} />
          ))}
        </div>
      )}

      <div className="mt-12">
        <div className="flex items-center mb-6">
          <h2 className="text-2xl font-bold">Recent Workouts</h2>
          <History className="w-5 h-5 ml-2 text-muted-foreground" />
        </div>

        {!recentHistory?.length ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No workout history yet. Complete a workout to see it here!</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {recentHistory.map((history) => (
              <Link key={history.id} href={`/workouts/${history.workoutId}/history`}>
                <Card className="p-4 hover:bg-accent cursor-pointer transition-colors">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{history.workoutName}</h3>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(history.completedAt), "PPP")}
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}