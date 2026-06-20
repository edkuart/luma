"use client";

import { useState } from "react";

type ColorFieldProps = {
  name: string;
  label: string;
  helper: string;
  defaultValue: string;
};

const hexPattern = /^#[0-9a-fA-F]{0,6}$/;

export function ColorField({
  name,
  label,
  helper,
  defaultValue,
}: ColorFieldProps) {
  const [value, setValue] = useState(defaultValue);
  const isValid = /^#[0-9a-fA-F]{6}$/.test(value);

  return (
    <label className="grid gap-3 rounded-md border border-border/70 bg-background/40 p-4 text-sm">
      <span>
        <span className="block font-semibold">{label}</span>
        <span className="mt-1 block text-xs text-muted">{helper}</span>
      </span>
      <span className="grid grid-cols-[56px_1fr] gap-3">
        <input
          type="color"
          value={isValid ? value : defaultValue}
          onChange={(event) => setValue(event.target.value)}
          className="h-11 w-full rounded-md border border-border bg-background"
        />
        <input
          name={name}
          value={value}
          onChange={(event) => {
            const nextValue = event.target.value.trim();
            if (hexPattern.test(nextValue)) {
              setValue(nextValue);
            }
          }}
          className="h-11 rounded-md border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-cyan"
          pattern="#[0-9a-fA-F]{6}"
        />
      </span>
    </label>
  );
}
