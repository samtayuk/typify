import { useEffect, useState } from "react"
import classNames from 'classnames'
import { InformationCircleIcon, ExclamationCircleIcon, CheckCircleIcon } from "@heroicons/react/24/outline";



export const Toast = ({ children, type, timeout, onDismiss, autoDismiss }) => {
  const [time, setTime] = useState(timeout*1000);
  const [timer, setTimer] = useState(null);
  const [close, setClose] = useState(false);

  const iconClass = "w-8 h-8"

  const setupTimer = () => {
    if (autoDismiss) {
      setTimer(setTimeout(() => {
        setTime(time - 10);
        setTimer(null);
      }, 10));
    }
  }

  const clearTimer = () => {
    if (autoDismiss && timer) {
      clearTimeout(timer);
      setTimer(null);
    }
  }

  useEffect(() => {
    if (time <= 0) {
      setClose(true);
      return;
    }

    // is if statement necessary?
    if (!timer) {
      setupTimer();
    }

    return () => {
      clearTimer();
    }
  }, [time]);

  useEffect(() => {
    if (close) {
      const t = setTimeout(() => {
        onDismiss();
      }, 250);

      return () => {
        clearTimeout(t);
      }
    }
  }, [close]);

  return (
    <div
      className={classNames({
        "alert flex flex-col gap-0 px-3 md:p-0 overflow-hidden justify-stretch items-stretch w-fit md:w-full md:min-h-[70px]": true,
        "transition-opacity duration-250 ease-out hover:opacity-50": true,
        "alert-info": type === "info",
        "alert-success": type === "success",
        "alert-error": type === "error",
        "alert-warning": type === "warning",
        "opacity-0": close,

      })}
      onMouseEnter={() => clearTimer()}
      onMouseLeave={() => setupTimer()}
      onClick={() => setClose(true)}
    >
      <div className="flex gap-3 p-2 -mb-1 justify-center items-center">
        <div className=" hidden md:block">
          {type === "info" && (
            <InformationCircleIcon className={iconClass} />
          )}
          {type === "success" && (
            <CheckCircleIcon className={iconClass} />
          )}
          {type === "error" && (
            <ExclamationCircleIcon className={iconClass} />
          )}
          {type === "warning" && (
            <ExclamationCircleIcon className={iconClass} />
          )}
        </div>
        <div className="flex-grow text-center md:text-left">
          {children}
        </div>
      </div>
      <div className="h-1">
        <progress className={classNames({
          "progress h-full bg-transparent": true,
          "hidden": !autoDismiss
        })} value={time} max={timeout*1000}/>
      </div>
    </div>
  )
}