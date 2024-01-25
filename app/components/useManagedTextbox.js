import { useRef } from "react";
import { formatExpressionInPlace } from "./inputUtils";

export default function useManagedTextbox() {
  const textbox = useRef(null);
  const utils = {
    forceOnChange: () => {
      if (textbox.current) {
        const event = new Event("change", { bubbles: true });
        textbox.current.dispatchEvent(event);
      }
    },
    formatInput: (value) => {
      if (textbox.current) {
        const [start, end, length] = [
          textbox.current.selectionStart,
          textbox.current.selectionEnd,
          textbox.current.value.length,
        ];
        const [formatedStr, newStart, newEnd] = formatExpressionInPlace(
          value,
          start,
          end
        );
        textbox.current.setRangeText(formatedStr, 0, length, "end");
        textbox.current.setSelectionRange(newStart, newEnd);
        utils.forceOnChange();
      }
    },
    addText: (text) => {
      if (textbox.current) {
        const [start, end] = [
          textbox.current.selectionStart,
          textbox.current.selectionEnd,
        ];
        textbox.current.setRangeText(text, start, end, "end");
        utils.forceOnChange();
      }
    },
    setText: (text) => {
      if (textbox.current) {
        textbox.current.setRangeText(
          text,
          0,
          textbox.current.value.length,
          "end"
        );
        utils.forceOnChange();
      }
    },
    clear: () => {
      if (textbox.current) {
        const length = textbox.current.value.length;
        textbox.current.setRangeText("", 0, length, "end");
        utils.forceOnChange();
      }
    },
    backspace: () => {
      if (textbox.current) {
        const [start, end] = [
          textbox.current.selectionStart,
          textbox.current.selectionEnd,
        ];
        if (start > 0 || start - end !== 0) {
          if (start - end === 0) {
            textbox.current.setRangeText("", start - 1, end, "end");
            utils.forceOnChange();
          } else {
            textbox.current.setRangeText("", start, end, "end");
            utils.forceOnChange();
          }
        }
      }
    },
  };

  return { ref: textbox, ...utils };
}
