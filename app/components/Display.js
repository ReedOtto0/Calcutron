"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { formatExpressionInPlace } from "../lib/inputUtils";
import useAutoSizingFont from "../lib/useAutoSizingFont";
import styles from "./Display.module.css";
import useResizeObserver from "../lib/useResizeObserver";

const digit = /[0-9]/;
const mappedKeys = {
  ".": ".",
  "%": "%",
  "-": "−",
  "+": "+",
  "*": "×",
  x: "×",
  X: "×",
  "/": "÷",
  "(": "(",
  ")": ")",
  "^": "^",
  r: "√",
  "!": "!",
  e: "e",
  p: "π",
  s: "sin(",
  c: "cos(",
  t: "tan(",
  Enter: "=",
};

const fontScales = {
  sm: { input: [24, 64], output: [12, 32] },
  md: { input: [38, 82], output: [16, 48] },
  lg: { input: [42, 96], output: [32, 64] },
};

const Display = forwardRef(({ dispatch, calculate, result }, ref) => {
  const [value, setValue] = useState("");
  const [fontScale, setFontScale] = useState(fontScales.md);
  const [autoSizeInput, resizeInput] = useAutoSizingFont(...fontScale.input);
  const [autoSizeOutput, resizeOutput] = useAutoSizingFont(...fontScale.output);
  const containerRef = useRef(null);
  const mySize = useResizeObserver(containerRef);

  useEffect(() => {
    if (mySize.target) {
      if (mySize.contentRect.height <= 200 && fontScale !== fontScales.sm) {
        requestAnimationFrame(() => {
          setFontScale(fontScales.sm);
          resizeInput();
          resizeOutput();
        });
      } else if (
        mySize.contentRect.height <= 400 &&
        fontScale !== fontScales.md
      ) {
        requestAnimationFrame(() => {
          setFontScale(fontScales.md);
          resizeInput();
          resizeOutput();
        });
      } else if (
        mySize.contentRect.height >= 400 &&
        fontScale !== fontScales.lg
      ) {
        requestAnimationFrame(() => {
          setFontScale(fontScales.lg);
          resizeInput();
          resizeOutput();
        });
      } else {
        requestAnimationFrame(resizeInput);
        requestAnimationFrame(resizeOutput);
      }
    }
  }, [mySize]);

  useImperativeHandle(ref, () => autoSizeInput.current, []);

  const handleChange = (e) => {
    setValue(e.target.value.replace("-", "−"));
    calculate(e.target.value);
    requestAnimationFrame(resizeInput);
    requestAnimationFrame(resizeOutput);
  };

  const handleKeyDown = (e) => {
    e.preventDefault();
    if (digit.test(e.key)) {
      dispatch(e.key);
    }
    if (e.key in mappedKeys) {
      dispatch(mappedKeys[e.key]);
    } else if (e.key === "Backspace") {
      if (e.shiftKey) {
        dispatch("AC");
      } else {
        dispatch("bk");
      }
    }
  };

  return (
    <div className={styles.frame} ref={containerRef}>
      <div className="flex-grow w-full  -mt-4" />
      <input
        className={`${styles.display} ${styles.input}`}
        type="text"
        inputMode="none"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={(e) => e.target.focus()}
        ref={autoSizeInput}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
      />
      <p className={`${styles.display} ${styles.result}`} ref={autoSizeOutput}>
        {formatExpressionInPlace(result)[0].replace("-", "−")}
      </p>
    </div>
  );
});

export default Display;
