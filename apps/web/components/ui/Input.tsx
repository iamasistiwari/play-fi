/* eslint-disable @typescript-eslint/no-empty-object-type */

import { cva } from "class-variance-authority";
import React, { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "../../lib/utils";

const inputVariants = cva(
  "rounded-lg bg-transparent border border-neutral-600 placeholder:text-sm p-2 w-80 h-12 focus:outline focus:outline-blue-700",
);

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, placeholder, children, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(inputVariants({ className }))}
        placeholder={placeholder}
        {...props}
      >
        {children}
      </input>
    );
  },
);
Input.displayName = "A"

export default Input;
