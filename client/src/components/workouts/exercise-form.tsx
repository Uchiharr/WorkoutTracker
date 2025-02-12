import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
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

  const handleSubmit = (data: Omit<InsertExercise, "workoutId">) => {
    onSubmit(data);
    form.reset();
  };

  return (
    <div className="space-y-4 border p-4 rounded-lg">
      <h3 className="font-medium">Add Exercise</h3>

      <Form {...form}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Exercise Name" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <FormField
              control={form.control}
              name="sets"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Sets" 
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="reps"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Reps" 
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>

        <Button 
          type="button" 
          className="mt-4"
          onClick={form.handleSubmit(handleSubmit)}
        >
          Add Exercise
        </Button>
      </Form>
    </div>
  );
}