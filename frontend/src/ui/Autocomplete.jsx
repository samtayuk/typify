import React, { useRef } from "react";
import classNames from "classnames";

export const Autocomplete = ({ items, value, onChange, onItemSelect, ref=null, displayValue=(value) => value }) => {
  const topRef = useRef(null);

  return (
    <div
      className="dropdown w-full"
      ref={topRef}
    >
      <input
        type="text"
        className="input input-bordered w-full"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type something.."
        tabIndex={0}
        ref={ref}
      />
        <ul
          className={classNames({
            "dropdown-content bg-base-200 top-14 max-h-96 overflow-auto flex-col rounded-md menu menu-compact": true,
            "hidden": (items.length === 0) && (value?.length < 3),
          })}
          // use ref to calculate the width of parent
          style={{ width: topRef.current?.clientWidth }}
        >
          {items.map((item, index) => {
            return (
              <li
                key={index}
                tabIndex={index + 1}
                onClick={() => {
                  const elem = document.activeElement;
                  if (elem) {
                    elem?.blur();
                  }
                  onItemSelect(item);
                }}
                className="w-full btn btn-primary min-h-0 h-0 py-4 mb-2 text-xs"
              >
                {displayValue(item)}
              </li>
            );
          })}

          { value && (value.length >= 3) ? (

            <li
              tabIndex={10}
              onClick={() => {
                const elem = document.activeElement;
                if (elem) {
                  elem?.blur();
                }
                console.log("create", value);
                onItemSelect({name: value});
              }}
              className="w-full btn btn-secondary btn-outline min-h-0 h-0 py-4 mb-2 text-xs"
            >
              Create: {value}
            </li>
          ) : null}
        </ul>
    </div>
  );
};
