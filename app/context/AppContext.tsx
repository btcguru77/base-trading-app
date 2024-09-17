"use client";

import React, { createContext, useContext, useState } from "react";

type AppContextType = {
  darkMode: boolean;
  toggleDarkMode: () => void;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  return (
    <AppContext.Provider
      value={{ darkMode, toggleDarkMode, isLoading, setIsLoading }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
