import React, { useRef, useEffect, useState } from "react";
import classNames from "classnames";

export const Modal = ({ children, hidden }) => {

  const prevHidden = useRef(hidden);
  const [overlayHidden, setOverlayHidden] = useState(true);

  useEffect(() => {
    if (prevHidden.current === hidden) return;
    prevHidden.current = hidden;

    if (hidden) {
      setTimeout(() => setOverlayHidden(true), 300);
    } else {
      setOverlayHidden(false);
    }
  }, [hidden]);

  return (
    <div className={classNames({
      "absolute bottom-0 left-0 w-screen h-screen z-40 overflow-clip bg-black/70 pt-20": true,
      "hidden": overlayHidden,
    })}>
      <div className={classNames({
        "flex flex-col justify-center items-center w-full bg-base-200 rounded-t-3xl h-full overflow-hidden transition-all duration-1000": true,
        "translate-y-full": hidden,
      })}>
        {children}
      </div>
    </div>
  );
};
