"use client";

import styles from "./RangeSelector.module.css"; 

type OptionType<T> = {
  value: T;
  label: string;
};

interface SelectorProps<T extends number> {
  value: T;
  onChange: (value: T) => void;
  options: OptionType<T>[];
}

export default function RangeSelector<T extends number>({
  value,
  onChange,
  options,
}: SelectorProps<T>) {
  return (
    <div className={styles.selectorContainer}>
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={
            value === opt.value ? styles.buttonActive : styles.buttonDefault
          }
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}