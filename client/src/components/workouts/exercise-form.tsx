import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { insertExerciseSchema, type InsertExercise } from "@shared/schema";

interface ExerciseFormProps {
  onSubmit: (data: Omit<InsertExercise, "workoutId">) => void;
}

export function ExerciseForm({ onSubmit }: ExerciseFormProps) {
  const form = useForm<Omit<InsertExercise, "workoutId">>({
    resolver: zodResolver(insertExerciseSchema.omit({ workoutId: true })),
    defaultValues: {
      name: "",
      sets: 3,
      reps: 10,
      order: 0
    }
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => {
          onSubmit(data);
          form.reset();
        })}
        className="space-y-4 border p-4 rounded-lg"
      >
        <h3 className="font-medium">Add Exercise</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <Input
              placeholder="Exercise Name"
              {...form.register("name")}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              placeholder="Sets"
              {...form.register("sets", { valueAsNumber: true })}
            />
            <Input
              type="number"
              placeholder="Reps"
              {...form.register("reps", { valueAsNumber: true })}
            />
          </div>
        </div>

        <Button type="submit">Add Exercise</Button>
      </form>
    </Form>
  );
}
