import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { formatExpressionInPlace } from "./inputUtils";
import useAutoSizingFont from "./useAutoSizingFont";

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
  const [autoSizeInput, resizeInput] = useAutoSizingFont(16, 96);
  const [autoSizeOutput, resizeOutput] = useAutoSizingFont(16, 64);
  const containerRef = useRef(null);

  useImperativeHandle(ref, () => autoSizeInput.current, []);

  const handleChange = (e) => {
    setValue(e.target.value);
    calculate(e.target.value);
    resizeInput();
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
    <div
      className="rounded-b-[2rem] w-full flex-grow flex flex-col items-end justify-end overflow-hidden px-4 py-3 bg-slate-200"
      style={{ maxWidth: "42rem", background: "hwb(170 85% 9%)" }}
      ref={containerRef}
    >
      <input
        className="w-full text-right align-bottom overflow-x-scroll overflow-y-clip bg-transparent focus:outline-none"
        style={{
          fontSize: "64px",
          lineHeight: "1",
          height: "64px",
          transitionProperty: "height",
          transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
          transitionDuration: "150ms",
        }}
        type="text"
        inputMode="none"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={(e) => e.target.focus()}
        ref={autoSizeInput}
      />
      <p
        className="w-full text-right align-bottom overflow-x-scroll overflow-y-clip "
        style={{
          fontSize: "32px",
          lineHeight: "1",
          height: "32px",
          transitionProperty: "height",
          transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
          transitionDuration: "150ms",
        }}
        ref={autoSizeOutput}
      >
        {formatExpressionInPlace(result)[0]}
      </p>
    </div>
  );
});

export default Display;
