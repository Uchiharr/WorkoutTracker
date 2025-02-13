import { Link } from "wouter";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, History, Edit2 } from "lucide-react";
import type { Workout } from "@shared/schema";

interface WorkoutCardProps {
  workout: Workout;
}

export function WorkoutCard({ workout }: WorkoutCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{workout.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2">
          <Link href={`/workouts/${workout.id}/execute`}>
            <Button variant="default" className="w-full">
              <Play className="w-4 h-4 mr-2" />
              Start
            </Button>
          </Link>
          <Link href={`/workouts/${workout.id}/edit`}>
            <Button variant="outline" className="w-full">
              <Edit2 className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </Link>
          <Link href={`/workouts/${workout.id}/history`}>
            <Button variant="outline" className="w-full">
              <History className="w-4 h-4 mr-2" />
              History
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}