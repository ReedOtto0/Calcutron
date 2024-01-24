"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Display from "./components/Display";
import KeyPad from "./components/KeyPad";
import { debounce } from "lodash";
import { parseEquation } from "./components/calcUtils";
import { formatExpressionInPlace } from "./components/inputUtils";

export default function Home() {
  const [result, setResult] = useState(" ");
  const textbox = useRef(null);

  const calculate = useCallback(
    debounce(
      (value) => {
        setResult(parseEquation(value));
        formatInput(value);
      },
      400,
      {
        trailing: true,
      }
    ),
    []
  );

  useEffect(() => {
    if (textbox.current) {
      textbox.current.focus();
    }
  }, []);

  const forceOnChange = () => {
    if (textbox.current) {
      const event = new Event("change", { bubbles: true });
      textbox.current.dispatchEvent(event);
    }
  };

  const formatInput = (value) => {
    if (textbox.current) {
      const [start, end] = [
        textbox.current.selectionStart,
        textbox.current.selectionEnd,
      ];
      const [formatedStr, newStart, newEnd] = formatExpressionInPlace(
        value,
        start,
        end
      );
      textbox.current.setRangeText(
        formatedStr,
        0,
        textbox.current.value.length,
        "end"
      );
      textbox.current.setSelectionRange(newStart, newEnd);
      forceOnChange();
    }
  };

  const addText = (text) => {
    if (textbox.current) {
      const [start, end] = [
        textbox.current.selectionStart,
        textbox.current.selectionEnd,
      ];
      textbox.current.setRangeText(text, start, end, "end");
      forceOnChange();
    }
  };

  const clear = () => {
    if (textbox.current) {
      const length = textbox.current.value.length;
      textbox.current.setRangeText("", 0, length, "end");
      forceOnChange();
    }
  };

  const backspace = () => {
    if (textbox.current) {
      const [start, end] = [
        textbox.current.selectionStart,
        textbox.current.selectionEnd,
      ];
      if (start > 0 || start - end !== 0) {
        if (start - end === 0) {
          textbox.current.setRangeText("", start - 1, end, "end");
          forceOnChange();
        } else {
          textbox.current.setRangeText("", start, end, "end");
          forceOnChange();
        }
      }
    }
  };

  const handleKeys = (key) => {
    if (typeof key === "number") {
      addText(key.toString(10));
    } else {
      switch (key) {
        case "AC":
          clear();
          break;
        case "bk":
          backspace();
          break;
        default:
          addText(key);
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
        ref={textbox}
      />
      <KeyPad dispatch={handleKeys} />
    </main>
  );
}
