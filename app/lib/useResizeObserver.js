"use client";

import { useCallback, useContext, useEffect, useState } from "react";
import { ObserverContext } from "./ObserverProvider";
import { throttle } from "lodash";

export default function useResizeObserver(ref) {
  const [observedSize, setObservedSize] = useState("lol");
  const observer = useContext(ObserverContext);

  const callback = useCallback(
    throttle(
      (observed) => {
        setObservedSize(observed);
      },
      300,
      { trailing: true }
    ),
    []
  );

  useEffect(() => {
    if (ref.current) {
      if (observer) {
        observer.addToList(ref.current, callback);
        return () => observer.removeFromList(ref.current);
      }
    }
  }, []);

  return observedSize;
}
