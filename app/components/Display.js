import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { formatExpressionInPlace } from "./inputUtils";
import useAutoSizingFont from "./useAutoSizingFont";
import styles from "./Display.module.css";

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

const Display = forwardRef(({ dispatch, calculate, result }, ref) => {
  const [value, setValue] = useState("");
  const [autoSizeInput, resizeInput] = useAutoSizingFont(28, 88);
  const [autoSizeOutput, resizeOutput] = useAutoSizingFont(16, 56);
  const containerRef = useRef(null);

  useImperativeHandle(ref, () => autoSizeInput.current, []);

  const handleChange = (e) => {
    setValue(e.target.value);
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
        {formatExpressionInPlace(result)[0]}
      </p>
    </div>
  );
});

export default Display;
