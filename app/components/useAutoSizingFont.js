import { useEffect, useRef } from "react";

export default function useAutoSizingFont(min, max) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      resize();
    }
  }, []);

  const setScale = () => {
    ref.current.style.fontSize = max.toString().concat("px");
    resize();
  };

  const resize = () => {
    const el = ref.current;
    const fontSize = parseInt(el.style.fontSize.replace("px", ""), 10);
    //console.log(`called Resize!`);

    if (el.scrollWidth !== el.clientWidth) {
      if (fontSize > min) {
        el.style.fontSize = (fontSize - 2).toString().concat("px");
        resize();
      }
    }
  };

  return [ref, setScale];
}
