import { createContext, useCallback, useEffect, useRef } from "react";

let observerList = [];

export const ObserverContext = createContext(null);

export default function ObserverProvider({ children }) {
  const observer = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    if (!observer.current) {
      //console.log("Registering Observer");
      observer.current = new ResizeObserver((entries) => {
        //console.log("Observed change");
        for (const entrie of entries) {
          observerList.forEach((item) => {
            if (item.el === entrie.target) {
              item.callback(entrie);
            }
          });
        }
      });
    }
  }, []);

  const addToList = useCallback(
    (el, call) => {
      observerList.push({ el: el, callback: call });
      if (observer.current) {
        //console.log("Adding observed element");
        observer.current.observe(el);
      }
    },
    [observer.current]
  );

  const removeFromList = useCallback(
    (el) => {
      observerList = observerList.filter((item) => item.el !== el);
      if (observer.current) {
        observer.current.unobserve(el);
      }
    },
    [observer.current]
  );

  return (
    <ObserverContext.Provider
      value={{ addToList: addToList, removeFromList: removeFromList }}
    >
      {children}
    </ObserverContext.Provider>
  );
}
