"use client";

import { useId } from "react";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export const HoneypotField = ({ value, onChange }: Props) => {
  const fieldId = useId();
  return (
    <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
      <label htmlFor={fieldId}>Company website</label>
      <input
        id={fieldId}
        name="website"
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        tabIndex={-1}
        autoComplete="off"
      />
    </div>
  );
};
