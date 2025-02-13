import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { SettingsProvider } from "@/contexts/settings";
import { Header } from "@/components/header";
import NotFound from "@/pages/not-found";
import WorkoutList from "@/pages/workouts";
import CreateWorkout from "@/pages/workouts/create";
import EditWorkout from "@/pages/workouts/edit";
import ExecuteWorkout from "@/pages/workouts/execute";
import WorkoutHistory from "@/pages/workouts/history";

function Router() {
  return (
    <Switch>
      <Route path="/" component={WorkoutList} />
      <Route path="/workouts/create" component={CreateWorkout} />
      <Route path="/workouts/:id/execute" component={ExecuteWorkout} />
      <Route path="/workouts/:id/edit" component={EditWorkout} />
      <Route path="/workouts/:id/history" component={WorkoutHistory} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SettingsProvider>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            <Router />
          </main>
        </div>
        <Toaster />
      </SettingsProvider>
    </QueryClientProvider>
  );
}

export default App;