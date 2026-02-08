"use client";

import { forwardRef } from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    const classes = ["cp-input", className].filter(Boolean).join(" ");
    return <input ref={ref} className={classes} {...props} />;
  },
);

Input.displayName = "Input";

export default Input;
