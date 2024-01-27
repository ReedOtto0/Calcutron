"use client";

import { memo, useEffect, useRef, useState } from "react";
import CalcButton from "./CalcButton";
import styles from "./KeyPad.module.css";
import useResizeObserver from "../lib/useResizeObserver";

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

const buildGrid = (layout) => {
  const grid = {};
  for (let row = 0; row < layout.length; row++) {
    for (let col = 0; col < layout.length; col++) {
      grid[layout[row][col]] = `${row + 1} / ${col + 1} / ${row + 2} / ${
        col + 2
      }`;
    }
  }
  return grid;
};

const KeyPad = memo(({ dispatch }) => {
  const [keyGrid, setKeyGrid] = useState(buildGrid(portraitKeys));
  const [orientation, setOrientation] = useState("portrait");
  const [drawerType, setDrawerType] = useState("drawer");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const ref = useRef(null);
  const mySize = useResizeObserver(ref);

  useEffect(() => {
    if (mySize.target) {
      if (mySize.contentRect.width > 500) {
        requestAnimationFrame(() => {
          setKeyGrid(buildGrid(landscapeKeys));
          setOrientation("landscape");
        });
      } else {
        requestAnimationFrame(() => {
          setKeyGrid(buildGrid(portraitKeys));
          setOrientation("portrait");
        });
      }
    }
  }, [mySize]);

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div
        className={`${styles.keypad} ${
          orientation === "portrait" ? styles.portrait : styles.landscape
        }`}
        ref={ref}
      >
        {portraitKeys.flat().map((key) => {
          return (
            <CalcButton
              label={key}
              grid={keyGrid[key]}
              click={() => {
                dispatch(key);
              }}
              buttonClass={key in keyStyles ? keyStyles[key] : ""}
              key={`${key}_button`}
            />
          );
        })}
      </div>
    </div>
  );
});

export default KeyPad;
