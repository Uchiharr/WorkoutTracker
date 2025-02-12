import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import WorkoutList from "@/pages/workouts";
import CreateWorkout from "@/pages/workouts/create";
import ExecuteWorkout from "@/pages/workouts/execute";
import WorkoutHistory from "@/pages/workouts/history";

function Router() {
  return (
    <Switch>
      <Route path="/" component={WorkoutList} />
      <Route path="/workouts/create" component={CreateWorkout} />
      <Route path="/workouts/:id/execute" component={ExecuteWorkout} />
      <Route path="/workouts/:id/history" component={WorkoutHistory} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
