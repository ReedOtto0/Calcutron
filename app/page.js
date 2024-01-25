"use client";

import { useCallback, useState } from "react";
import Display from "./components/Display";
import KeyPad from "./components/KeyPad";
import { debounce } from "lodash";
import { parseEquation } from "./components/calcUtils";
import useManagedTextbox from "./components/useManagedTextbox";

export default function Home() {
  const [result, setResult] = useState(" ");
  const textbox = useManagedTextbox();

  const calculate = useCallback(
    debounce(
      (value) => {
        setResult(parseEquation(value));
        textbox.formatInput(value);
      },
      150,
      {
        trailing: true,
      }
    ),
    []
  );

  const handleKeys = (key) => {
    if (typeof key === "number") {
      textbox.addText(key.toString(10));
    } else {
      switch (key) {
        case "AC":
          textbox.clear();
          break;
        case "bk":
          textbox.backspace();
          break;
        case "=":
          textbox.setText(parseEquation(textbox.current.value));
          break;
        default:
          textbox.addText(key);
          break;
      }
    }
  };

  return (
    <main
      className="min-h-dvh w-full flex flex-col items-center justify-center"
      style={{ background: "hwb(140 97% 0%)" }}
    >
      <Display
        result={`${result}`}
        dispatch={handleKeys}
        calculate={calculate}
        ref={textbox.ref}
      />
      <KeyPad dispatch={handleKeys} />
    </main>
  );
}
