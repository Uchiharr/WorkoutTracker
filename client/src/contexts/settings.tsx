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
    // Update various UI element colors
    document.documentElement.style.setProperty('--primary', color);
    document.documentElement.style.setProperty('--border', color);
    document.documentElement.style.setProperty('--ring', color);
    document.documentElement.style.setProperty('--input', color);
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