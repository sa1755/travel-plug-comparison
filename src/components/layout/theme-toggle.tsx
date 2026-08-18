"use client";

import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";

type Theme = "light" | "dark";

const STORAGE_KEY = "travelplug-theme";
const CHANGE_EVENT = "travelplug-theme-change";

function getTheme(): Theme {
  if (typeof document === "undefined") return "light";
  if (document.documentElement.dataset.theme === "dark") return "dark";
  if (document.documentElement.dataset.theme === "light") return "light";
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function subscribe(onStoreChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onStoreChange);
  return () => window.removeEventListener(CHANGE_EVENT, onStoreChange);
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // The selected theme still applies when persistent storage is blocked.
  }
  document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')?.setAttribute(
    "content",
    theme === "dark" ? "#181613" : "#f4efe6",
  );
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getTheme, () => "light");
  const nextTheme = theme === "dark" ? "light" : "dark";
  const Icon = theme === "dark" ? Sun : Moon;

  return (
    <button
      type="button"
      className="inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-sm font-semibold text-muted hover:bg-surface-muted hover:text-foreground sm:px-4"
      aria-label={`Switch to ${nextTheme} mode`}
      title={`Switch to ${nextTheme} mode`}
      aria-pressed={theme === "dark"}
      onClick={() => applyTheme(nextTheme)}
    >
      <Icon className="size-4.5" aria-hidden="true" />
      <span className="hidden xl:inline">{theme === "dark" ? "Light mode" : "Dark mode"}</span>
    </button>
  );
}
