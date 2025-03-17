"use client";

import * as React from "react";
import { OTPInput, SlotProps } from "input-otp";
import { cn } from "@/lib/utils";

const InputOTP = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof OTPInput>>(
  ({ className, ...props }, ref) => (
    <OTPInput
      ref={ref}
      containerClassName={cn("flex items-center gap-2", className)}
      {...props}
    />
  )
);
InputOTP.displayName = "InputOTP";

const InputOTPGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center", className)}
    {...props}
  />
));
InputOTPGroup.displayName = "InputOTPGroup";

const InputOTPSlot = React.forwardRef<
  HTMLInputElement,
  SlotProps & React.InputHTMLAttributes<HTMLInputElement>
>(({ char, hasFakeCaret, isActive, className, ...props }, ref) => (
  <div className="relative">
    <input
      ref={ref}
      className={cn(
        "w-10 h-10 text-center text-lg font-medium border rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all",
        isActive && "border-primary",
        className
      )}
      {...props}
    />
    {hasFakeCaret && (
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center animate-caret-blink">
        <div className="w-px h-6 bg-primary" />
      </div>
    )}
    {char && (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {char}
      </div>
    )}
  </div>
));
InputOTPSlot.displayName = "InputOTPSlot";

export { InputOTP, InputOTPGroup, InputOTPSlot };