"use client";

import { useCallback, useState } from "react";
import Display from "./components/Display";
import KeyPad from "./components/KeyPad";
import { debounce } from "lodash";
import { parseEquation } from "./lib/calcUtils";
import useManagedTextbox from "./lib/useManagedTextbox";
import ObserverProvider from "./lib/ObserverProvider";

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

  const handleSubmission = () => {
    textbox.setText(parseEquation(textbox.ref.current.value));
  };

  const handleKeys = useCallback(
    (key) => {
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
            handleSubmission();
            break;
          default:
            textbox.addText(key);
            break;
        }
      }
    },
    [
      textbox.addText,
      textbox.clear,
      textbox.backspace,
      textbox.setText,
      textbox.addText,
    ]
  );

  return (
    <ObserverProvider>
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
    </ObserverProvider>
  );
}
