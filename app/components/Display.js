import { forwardRef, useState } from "react";

const Display = forwardRef(({ dispatch, calculate, result }, ref) => {
  const [value, setValue] = useState("");
  const [changing, setChanging] = useState(false);

  const handleChange = (e) => {
    setValue(e.target.value);
    if (!changing) {
      setChanging(true);
    }
    calculate(e.target.value);
  };

  const mappedKeys = {
    0: 0,
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
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
      className="rounded-b-[2rem] w-full flex-grow flex flex-col items-end justify-end overflow-hidden px-6 py-4 bg-slate-200"
      style={{ maxWidth: "40rem" }}
    >
      <input
        className="w-full text-right align-bottom bg-transparent inline-block focus:outline-none"
        style={{ fontSize: "4rem", lineHeight: "1.25" }}
        type="text"
        inputMode="none"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={(e) => e.target.focus()}
        ref={ref}
      />
      <p
        className="w-full text-right align-bottom"
        style={{ fontSize: "2.5rem", lineHeight: "1.25", minHeight: "40px" }}
      >
        {result}
      </p>
    </div>
  );
});

export default Display;
