import React from "react";

interface BindingProps {
  // Add props as needed
}

const Binding: React.FC<BindingProps> = () => {
  return (
    <div className=" w-[200px] absolute h-full   centerFlex">
      <div className="bg-amber-900/80 h-full w-[2px]"></div>
    </div>
  );
};

export default Binding;
