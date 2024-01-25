"use client";

import CalcButton from "./CalcButton";
import styles from "./KeyPad.module.css";

const keyStyles = {
  AC: styles.clear,
  "=": styles.equal,
  "( )": styles.brackets,
  "%": styles.operation,
  "÷": styles.operation,
  "×": styles.operation,
  "−": styles.operation,
  "+": styles.operation,
  bk: styles.back,
};

const portraitKeys = [
  ["AC", "( )", "%", "÷"],
  [7, 8, 9, "×"],
  [4, 5, 6, "−"],
  [1, 2, 3, "+"],
  [0, ".", "bk", "="],
];

const landscapeKeys = [
  [7, 8, 9, "÷", "AC"],
  [4, 5, 6, "×", "( )"],
  [1, 2, 3, "−", "%"],
  [0, ".", "bk", "+", "="],
];

export default function KeyPad({ dispatch }) {
  return (
    <div className={`${styles.keypad} ${styles.landscape}`}>
      {landscapeKeys.flat().map((key, i) => {
        const [row, col] = [Math.floor(i / 5) + 1, (i % 5) + 1];
        return (
          <CalcButton
            label={key}
            grid={`${row} / ${col} / ${row + 1} / ${col + 1}`}
            click={() => {
              dispatch(key);
            }}
            buttonClass={key in keyStyles ? keyStyles[key] : ""}
            key={`${key}_button`}
          />
        );
      })}
    </div>
  );
}
