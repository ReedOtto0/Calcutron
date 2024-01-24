"use client";

import CalcButton from "./CalcButton";

export default function KeyPad({ dispatch }) {
  const keys = [
    [{ label: "AC" }, { label: "()" }, { label: "%" }, { label: "÷" }],
    [{ label: 7 }, { label: 8 }, { label: 9 }, { label: "×" }],
    [{ label: 4 }, { label: 5 }, { label: 6 }, { label: "-" }],
    [{ label: 1 }, { label: 2 }, { label: 3 }, { label: "+" }],
    [{ label: 0 }, { label: "." }, { label: "bk" }, { label: "=" }],
  ];

  return (
    <div
      style={{
        display: "grid",
        width: "100%",
        maxWidth: "40rem",
        aspectRatio: "4 / 5",
        gridTemplateColumns: "repeat(4, 1fr)",
        gridTemplateRows: "repeat(5, 1fr)",
        gap: "10px",
        padding: "1.5rem",
      }}
    >
      {keys.flat().map((key, i) => {
        const [row, col] = [Math.floor(i / 4) + 1, (i % 4) + 1];
        return (
          <CalcButton
            label={key.label}
            grid={`${row} / ${col} / ${row + 1} / ${col + 1}`}
            click={() => {
              dispatch(key.label);
            }}
            key={`${key.label}_button`}
          />
        );
      })}
    </div>
  );
}
