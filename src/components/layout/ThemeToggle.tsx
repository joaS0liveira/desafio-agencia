"use client";

import { Icon } from "@/components/ui/Icon";
import { setTheme, type Theme, useTheme } from "@/hooks/useTheme";

const options: { value: Theme; icon: "sun" | "moon"; label: string }[] = [
  { value: "light", icon: "sun", label: "Modo claro" },
  { value: "dark", icon: "moon", label: "Modo escuro" },
];

export function ThemeToggle() {
  const theme = useTheme();

  return (
    <fieldset className="flex h-10 items-center rounded-lg border border-border bg-surface-soft p-[3px]">
      <legend className="sr-only">Tema</legend>
      {options.map((option) => {
        const active = theme === option.value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            aria-label={option.label}
            title={option.label}
            onClick={() => setTheme(option.value)}
            className={`grid h-8 w-10 place-items-center rounded-md transition-colors ${
              active
                ? "bg-surface text-primary-strong shadow-sm"
                : "text-muted hover:text-text"
            }`}
          >
            <Icon name={option.icon} size={16} />
          </button>
        );
      })}
    </fieldset>
  );
}
