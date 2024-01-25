"use client";

import CalcButton from "./CalcButton";

export default function KeyPad({ dispatch }) {
  const keyStyles = {
    AC: {
      css: {
        background: "hwb(200 77% 4%)",
        fontSize: "2.25rem",
        fontWeight: "500",
      },
    },
    "=": { css: { background: "hwb(160 58% 5%)", fontSize: "3.75rem" } },
    "( )": {
      css: {
        background: "hwb(160 77% 9%)",
        fontSize: "2.5rem",
      },
    },
    "%": {
      css: {
        background: "hwb(160 77% 9%)",
        fontSize: "2.5rem",
      },
    },
    "÷": {
      css: {
        background: "hwb(160 77% 9%)",
        fontSize: "3.5rem",
      },
    },
    "×": {
      css: {
        background: "hwb(160 77% 9%)",
        fontSize: "3.5rem",
      },
    },
    "−": {
      css: {
        background: "hwb(160 77% 9%)",
        fontSize: "3.5rem",
      },
    },
    "+": {
      css: {
        background: "hwb(160 77% 9%)",
        fontSize: "3.5rem",
      },
    },
    bk: {
      css: {
        fontSize: "2.25rem",
        fontWeight: "500",
      },
    },
  };

  const keys = [
    [{ label: "AC" }, { label: "( )" }, { label: "%" }, { label: "÷" }],
    [{ label: 7 }, { label: 8 }, { label: 9 }, { label: "×" }],
    [{ label: 4 }, { label: 5 }, { label: 6 }, { label: "−" }],
    [{ label: 1 }, { label: 2 }, { label: 3 }, { label: "+" }],
    [{ label: 0 }, { label: "." }, { label: "bk" }, { label: "=" }],
  ];

  return (
    <div
      style={{
        display: "grid",
        width: "100%",
        maxWidth: "42rem",
        aspectRatio: "4 / 5",
        gridTemplateColumns: "repeat(4, 1fr)",
        gridTemplateRows: "repeat(5, 1fr)",
        gap: "8px",
        padding: "1rem",
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
            buttonStyle={key.label in keyStyles ? keyStyles[key.label].css : {}}
            key={`${key.label}_button`}
          />
        );
      })}
    </div>
  );
}
