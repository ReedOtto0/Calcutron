"use client";

import styles from "./KeyPad.module.css";

export default function CalcButton({ label, click, grid, buttonClass }) {
  return (
    <button
      className={`active:bg-slate-400 rounded-full ${styles.button} ${buttonClass}`}
      style={{
        gridArea: grid,
      }}
      onClick={(e) => {
        e.preventDefault();
        click(e);
      }}
      onMouseDown={(e) => {
        e.preventDefault();
      }}
    >
      {label}
    </button>
  );
}
