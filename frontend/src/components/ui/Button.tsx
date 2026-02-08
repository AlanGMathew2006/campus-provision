"use client";

import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const baseClass = "cp-button";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "cp-button--primary",
  ghost: "cp-button--ghost",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "cp-button--sm",
  md: "cp-button--md",
  lg: "cp-button--lg",
};

const joinClasses = (...parts: Array<string | undefined | false>) =>
  parts.filter(Boolean).join(" ");

export default function Button({
  variant = "primary",
  size = "md",
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      className={joinClasses(
        baseClass,
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      type={type}
      {...props}
    />
  );
}
