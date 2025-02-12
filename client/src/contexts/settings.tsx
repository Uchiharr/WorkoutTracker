import { createContext, useContext, useState } from "react";

type WeightUnit = "kg" | "lb";

interface SettingsContextType {
  weightUnit: WeightUnit;
  setWeightUnit: (unit: WeightUnit) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [weightUnit, setWeightUnit] = useState<WeightUnit>(() => {
    // Try to load from localStorage, default to "lb"
    const stored = localStorage.getItem("weightUnit");
    return (stored === "kg" || stored === "lb") ? stored : "lb";
  });

  const handleSetWeightUnit = (unit: WeightUnit) => {
    localStorage.setItem("weightUnit", unit);
    setWeightUnit(unit);
  };

  return (
    <SettingsContext.Provider value={{ weightUnit, setWeightUnit: handleSetWeightUnit }}>
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
