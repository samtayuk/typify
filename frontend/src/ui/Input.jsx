import React from "react";

export const Input = React.forwardRef(
  (
    { onChange, onBlur, name, type = "text", placeholder, className = "" },
    ref
  ) => (
    <input
      type={type}
      name={name}
      id={name}
      ref={ref}
      onChange={onChange}
      onBlur={onBlur}
      placeholder={placeholder}
      className={`input input-bordered ${className}`}
    />
  )
);

export const FormInput = React.forwardRef(
  (
    {
      onChange,
      onBlur,
      name,
      label,
      type = "text",
      errors,
      placeholder,
      className = "",
    },
    ref
  ) => {
    errors = errors[name];

    if (errors && errors.type === "required") {
      errors.message = `${label} is required`;
    }

    return (
      <div className="form-control">
        <label className="label">
          <span className="label-text">{label}</span>
        </label>
        <Input
          type={type}
          name={name}
          id={name}
          ref={ref}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          className={`${errors && "border-red-500"} ${className}`}
        />
        <p
          role="alert"
          className="text-xs text-red-500 block h-0.5 mt-0.5 ml-1"
        >
          {errors && errors.message}
        </p>
      </div>
    );
  }
);