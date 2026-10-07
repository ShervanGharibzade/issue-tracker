"use client";

import { useRef } from "react";

interface InlineInputProps {
  initialValue?: string;
  ariaLabel: string;
  placeholder?: string;
  maxLength?: number;
  className?: string;
  /** Called with the trimmed, non-empty value on Enter or blur. */
  onCommit: (value: string) => void;
  /** Called on Escape, or on blur when the value is empty. */
  onCancel: () => void;
}

/**
 * Single-line editor for renaming things in place.
 * Enter / blur saves, Escape cancels. Mount it only while editing.
 */
export default function InlineInput({
  initialValue = "",
  ariaLabel,
  placeholder,
  maxLength = 60,
  className = "",
  onCommit,
  onCancel,
}: InlineInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const finished = useRef(false);

  function finish(save: boolean) {
    if (finished.current) return;
    finished.current = true;
    const value = inputRef.current?.value.trim() ?? "";
    if (save && value) onCommit(value);
    else onCancel();
  }

  return (
    <input
      ref={inputRef}
      autoFocus
      defaultValue={initialValue}
      aria-label={ariaLabel}
      placeholder={placeholder}
      maxLength={maxLength}
      onFocus={(event) => event.currentTarget.select()}
      onBlur={() => finish(true)}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          finish(true);
        } else if (event.key === "Escape") {
          event.preventDefault();
          event.stopPropagation();
          finish(false);
        }
      }}
      className={`field py-1.5 ${className}`}
    />
  );
}
