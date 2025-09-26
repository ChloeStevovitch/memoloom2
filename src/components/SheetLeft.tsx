import { useMemo, useState } from "react";
import { cn } from "../main";
import Page from "./Page";

interface SheetLeftProps {
  currentPair: number;
  isFlippingTo: number;
  handleFlipEndPage: () => void;
  children?: React.ReactNode;
  id: number;
  className?: string;
}

function SheetLeft({
  id,
  currentPair,
  isFlippingTo,
  handleFlipEndPage,
}: SheetLeftProps) {
  const [zIndexProperty, setZIndexProperty] = useState(
    1000 - Math.abs(currentPair - id)
  );

  const handleZIndexChange = useMemo(() => {
    return () => {
      const newValue =
        currentPair === id || currentPair === id - 1
          ? 1000
          : 1000 - Math.abs(currentPair - id);

      setTimeout(() => {
        setZIndexProperty(newValue);
        console.log("zIndexProperty changed");
      }, 500);
    };
  }, [currentPair]);

  return (
    <div
      onTransitionEnd={handleFlipEndPage}
      onTransitionRun={handleZIndexChange}
      className={cn(
        "pageContainer",
        "left",
        id > currentPair + 2 && "hidden",
        isFlippingTo < id ? "rotate-y-180" : ""
      )}
      style={{
        zIndex: zIndexProperty,
      }}
    >
      <Page id={id - 1} className="page verso">
        {id - 1} verso
      </Page>
      <Page id={id} className="page recto">
        {id} recto
      </Page>
    </div>
  );
}
export default SheetLeft;
