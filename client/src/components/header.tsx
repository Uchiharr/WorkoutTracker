import { Link } from "wouter";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useSettings } from "@/contexts/settings";

export function Header() {
  const { weightUnit, setWeightUnit } = useSettings();

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/">
          <h1 className="text-xl font-bold cursor-pointer">Workout Tracker</h1>
        </Link>

        <div className="flex items-center space-x-2">
          <Label htmlFor="unit-toggle">Weight Unit:</Label>
          <div className="flex items-center space-x-2">
            <span className={weightUnit === "lb" ? "font-medium" : "text-muted-foreground"}>lbs</span>
            <Switch
              id="unit-toggle"
              checked={weightUnit === "kg"}
              onCheckedChange={(checked) => setWeightUnit(checked ? "kg" : "lb")}
            />
            <span className={weightUnit === "kg" ? "font-medium" : "text-muted-foreground"}>kg</span>
          </div>
        </div>
      </div>
    </header>
  );
}
