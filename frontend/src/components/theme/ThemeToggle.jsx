// src/components/theme/ThemeToggle.jsx
"use client";
import React from "react";
import { useTheme } from "./ThemeProvider";
import Image from "next/image";
import light from "../../../public/light.svg"
import dark from "../../../public/night.svg"

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const flip = () => {
    const root = document.documentElement 
    root.classList.add('theme-animating')
    setTimeout(() => root.classList.remove('theme-animating'), 320) 
    setTheme(next)
  }

  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const next = theme === "dark" ? "light" : "dark";
  const label = mounted ? (theme === "dark" ? <Image src={light} alt="switch to light" width={25} height={25} /> : <Image src={dark} alt="switch to dark" width={25} height={25}/>) : "Toggle theme";

  return (
    <button
      onClick={() => flip()}
      className="inline-flex items-center hover:scale-105 rounded-[var(--radius)] px-3 py-2 bg-primary text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary ring-offset-2"
      aria-label="Toggle theme"
    >
      {label}
    </button>
  );
}
