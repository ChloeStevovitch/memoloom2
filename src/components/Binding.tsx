import React from "react";
import { cn } from "../main";

interface BindingProps extends React.HTMLAttributes<HTMLDivElement> {}

function Binding({ className, ...props }: BindingProps) {
  return (
    <div
      className={cn(
        "w-[200px] absolute h-full  pointer-events-none  centerFlex",
        className
      )}
      {...props}
    >
      <div className="bg-amber-900/80 h-[calc(100%-20px)] w-[2px]"></div>
    </div>
  );
}

export default Binding;
