"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { getMediaUrl } from "@/lib/media";
import styles from "./Select.module.scss";

export type SelectOption = {
  value: string;
  label: string;
};

type SelectProps = {
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  variant?: "default" | "compact";
  className?: string;
  "aria-label"?: string;
};

export default function Select({
  options,
  value: controlledValue,
  defaultValue,
  onChange,
  placeholder,
  disabled = false,
  variant = "default",
  className,
  "aria-label": ariaLabelProp,
}: SelectProps) {
  const t = useTranslations("select");
  const placeholderResolved = placeholder ?? t("placeholder");
  const ariaLabel = ariaLabelProp ?? t("ariaLabel");
  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue ?? "");
  const rootRef = useRef<HTMLDivElement>(null);

  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  const selectedOption = options.find((o) => o.value === value);
  const displayLabel = selectedOption?.label ?? placeholderResolved;

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleSelect = (optionValue: string) => {
    if (!isControlled) setInternalValue(optionValue);
    onChange?.(optionValue);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    switch (e.key) {
      case "Enter":
      case " ":
        e.preventDefault();
        setIsOpen((prev) => !prev);
        break;
      case "Escape":
        setIsOpen(false);
        break;
      case "ArrowDown":
        e.preventDefault();
        if (!isOpen) setIsOpen(true);
        break;
      default:
        break;
    }
  };

  return (
    <div
      ref={rootRef}
      className={`${styles.root} ${className ?? ""}`.trim()}
      data-open={isOpen}
      data-disabled={disabled}
      data-variant={variant}
    >
      <button
        type="button"
        className={styles.trigger}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel}
        aria-labelledby={undefined}
      >
        <span className={styles.value}>{displayLabel}</span>
        <span className={styles.icon} aria-hidden>
          <Image
            src={getMediaUrl("/arrow-down.svg")}
            unoptimized
            alt=""
            width={8}
            height={5}
            className={styles.iconImage}
          />
        </span>
      </button>

      {isOpen && (
        <ul
          className={styles.dropdown}
          role="listbox"
          aria-activedescendant={value ? `option-${value}` : undefined}
        >
          {options.map((option) => (
            <li
              key={option.value}
              id={`option-${option.value}`}
              role="option"
              aria-selected={option.value === value}
              className={styles.option}
              onClick={() => handleSelect(option.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleSelect(option.value);
                }
              }}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
