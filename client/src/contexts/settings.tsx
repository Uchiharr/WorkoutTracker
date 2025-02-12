import { createContext, useContext, useState, useEffect } from "react";

type WeightUnit = "kg" | "lb";
type ThemeMode = "light" | "dark";

interface SettingsContextType {
  weightUnit: WeightUnit;
  setWeightUnit: (unit: WeightUnit) => void;
  accentColor: string;
  setAccentColor: (color: string) => void;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [weightUnit, setWeightUnit] = useState<WeightUnit>(() => {
    const stored = localStorage.getItem("weightUnit");
    return (stored === "kg" || stored === "lb") ? stored : "lb";
  });

  const [accentColor, setAccentColor] = useState(() => {
    return localStorage.getItem("accentColor") || "#3b82f6";
  });

  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    return (localStorage.getItem("themeMode") as ThemeMode) || "light";
  });

  const handleSetWeightUnit = (unit: WeightUnit) => {
    localStorage.setItem("weightUnit", unit);
    setWeightUnit(unit);
  };

  const handleSetAccentColor = (color: string) => {
    localStorage.setItem("accentColor", color);
    setAccentColor(color);

    // Convert hex to HSL for CSS variables
    const root = document.documentElement;
    root.style.setProperty('--primary', color);
    root.style.setProperty('--border', color);
    root.style.setProperty('--ring', color);
    root.style.setProperty('--input', color);
    root.style.setProperty('--accent', color);

    // Update toggle and interactive elements
    root.style.setProperty('--switch', color);
    root.style.setProperty('--switch-foreground', 'hsl(0 0% 100%)');
    root.style.setProperty('--focus-ring', `${color}33`); // 20% opacity version
  };

  const handleSetThemeMode = (mode: ThemeMode) => {
    localStorage.setItem("themeMode", mode);
    setThemeMode(mode);
    document.documentElement.classList.toggle("dark", mode === "dark");
  };

  // Initialize theme and colors on mount
  useEffect(() => {
    handleSetThemeMode(themeMode);
    handleSetAccentColor(accentColor);
  }, []);

  return (
    <SettingsContext.Provider value={{ 
      weightUnit, 
      setWeightUnit: handleSetWeightUnit,
      accentColor,
      setAccentColor: handleSetAccentColor,
      themeMode,
      setThemeMode: handleSetThemeMode
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}