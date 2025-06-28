"use client";

import React, { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export const DarkModeToggle = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check localStorage for the user's preference on initial load
    const savedPreference = localStorage.getItem("darkMode");
    if (savedPreference) {
      const isDarkMode = savedPreference === "true";
      setDarkMode(isDarkMode);
      document.documentElement.classList.toggle("dark", isDarkMode);
    }
  }, []);

  useEffect(() => {
    // Add a transition class for smooth animation
    const root = document.documentElement;
    root.classList.add("theme-transition");
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", darkMode.toString());

    // Remove the transition class after the animation
    const timeout = setTimeout(() => {
      root.classList.remove("theme-transition");
    }, 300); // Match the CSS transition duration

    return () => clearTimeout(timeout);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-105"
      aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
      title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {darkMode ? (
        <Sun className="w-5 h-5 text-yellow-500" />
      ) : (
        <Moon className="w-5 h-5 text-blue-600" />
      )}
    </button>
  );
};

export default DarkModeToggle;
