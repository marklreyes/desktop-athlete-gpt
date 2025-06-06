import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

type ThemeContextType = {
  isDarkMode: boolean;
  toggleTheme: () => void;
  theme: {
    background: string;
    text: string;
    primary: string;
    secondary: string;
    accent: string;
  };
};

const lightTheme = {
    background: "bg-[#f39416]", // 		Yellow-orange
    text: "text-[#FFFFFF]", // 		White
    primary: "#331C40", // 		Dark purple
    secondary: "#07EFFE", // 		Light blue
    accent: "#B4D0D1", // 		Light gray
		rgba: "rgba(255, 255, 255, 0.5)", // 		White with opacity
};

const darkTheme = {
    background: "bg-[#331C40]", // Dark purple
    text: "text-[#FFFFFF]", // 		White
    primary: "#f39416", // 		Yellow-orange
    secondary: "#01F1FC", // 		Light blue
    accent: "#B4D0D1", // 		Light gray
		rgba: "rgba(0, 0, 0, 0.5)", // 		Black with opacity
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Initialize with DARK mode as default (isDarkMode = true)
  // We'll use a function for initial state to avoid running this logic twice
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // During SSR, default to dark mode
    if (typeof window === 'undefined') return true;

    // Check if user has a saved preference
    const savedTheme = localStorage.getItem("theme");

    // If there's a saved preference, use it
    if (savedTheme) {
      return savedTheme === "dark";
    }

    // No saved preference, default to dark mode (not system preference)
    return true;
  });

  // Toggle theme function remains the same
  const toggleTheme = () => {
    setIsDarkMode(prev => {
      const newTheme = !prev;
      if (typeof window !== "undefined") {
        localStorage.setItem("theme", newTheme ? "dark" : "light");
      }
      return newTheme;
    });
  };

  // This effect is simplified - we ONLY listen for system preference changes
  // and only apply them if the user hasn't set a preference
  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

      const handler = (e: MediaQueryListEvent) => {
        // Only change theme based on system if no user preference exists
        if (!localStorage.getItem("theme")) {
          setIsDarkMode(e.matches);
        }
      };

      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    }
  }, []);

  const theme = isDarkMode ? darkTheme : lightTheme;

  // Keep the CSS variables effect as is
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty('--theme-primary', theme.primary);
      document.documentElement.style.setProperty('--theme-secondary', theme.secondary);
      document.documentElement.style.setProperty('--theme-accent', theme.accent);
      document.documentElement.style.setProperty('--theme-background', theme.background);
      document.documentElement.style.setProperty('--theme-rgba', theme.rgba);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
