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
      className="profile-btn flex items-center gap-2"
    >
      {darkMode ? <Sun className="text-xl" /> : <Moon className="text-xl" />}
      {darkMode ? "Light Mode" : "Dark Mode"}
    </button>
  );
};

export default DarkModeToggle;
