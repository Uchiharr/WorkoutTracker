import { Link } from "wouter";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useSettings } from "@/contexts/settings";
import { Moon, Sun } from "lucide-react";
import { Input } from "@/components/ui/input";

export function Header() {
  const { weightUnit, setWeightUnit, accentColor, setAccentColor, themeMode, setThemeMode } = useSettings();

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/">
          <h1 className="text-xl font-bold cursor-pointer">Workout Tracker</h1>
        </Link>

        <div className="flex items-center space-x-6">
          {/* Weight Unit Toggle */}
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

          {/* Theme Toggle */}
          <div className="flex items-center space-x-2">
            <Label htmlFor="theme-toggle">Theme:</Label>
            <div className="flex items-center space-x-2">
              <Sun className={`h-4 w-4 ${themeMode === 'light' ? 'text-primary' : 'text-muted-foreground'}`} />
              <Switch
                id="theme-toggle"
                checked={themeMode === "dark"}
                onCheckedChange={(checked) => setThemeMode(checked ? "dark" : "light")}
              />
              <Moon className={`h-4 w-4 ${themeMode === 'dark' ? 'text-primary' : 'text-muted-foreground'}`} />
            </div>
          </div>

          {/* Accent Color Picker */}
          <div className="flex items-center space-x-2">
            <Label htmlFor="accent-color">Accent:</Label>
            <Input
              id="accent-color"
              type="color"
              value={accentColor}
              onChange={(e) => setAccentColor(e.target.value)}
              className="w-8 h-8 p-0 border-none"
            />
          </div>
        </div>
      </div>
    </header>
  );
}