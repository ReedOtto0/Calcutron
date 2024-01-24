import { forwardRef, useImperativeHandle, useState } from "react";
import { formatExpressionInPlace } from "./inputUtils";
import useAutoSizingFont from "./useAutoSizingFont";

const Display = forwardRef(({ dispatch, calculate, result }, ref) => {
  const [value, setValue] = useState("");
  const [autoSizeInput, resizeInput] = useAutoSizingFont(64, 128);
  const [autoSizeOutput, resizeOutput] = useAutoSizingFont(32, 64);

  useImperativeHandle(ref, () => autoSizeInput.current, []);

  const handleChange = (e) => {
    setValue(e.target.value);
    resizeInput();
    calculate(e.target.value);
    resizeOutput();
  };

  const digit = /[0-9]/;
  const mappedKeys = {
    ".": ".",
    "%": "%",
    "-": "-",
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
      style={{ maxWidth: "40rem", background: "hwb(170 85% 9%)" }}
    >
      <input
        className="w-full text-right align-bottom bg-transparent overflow-x-scroll inline-block focus:outline-none"
        style={{
          fontSize: "64px",
          lineHeight: "1.25",
          transitionProperty: "height, top, left, transform",
          transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
          transitionDuration: "200ms",
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
        className="w-full text-right overflow-x-scroll align-bottom"
        style={{
          fontSize: "40px",
          lineHeight: "1.25",

          transitionProperty: "height, top, left, transform",
          transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
          transitionDuration: "1000ms",
        }}
        ref={autoSizeOutput}
      >
        {formatExpressionInPlace(result)[0]}
      </p>
    </div>
  );
});

export default Display;
