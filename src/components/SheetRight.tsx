import { cn } from "../main";
import Page from "./Page";

interface SheetRightProps {
  currentPair: number;
  isFlippingTo: number;
  handleFlipEndPage: () => void;
  children?: React.ReactNode;
  id: number;
  className?: string;
  zIndex: number;
  isFlipped: boolean;
}

function SheetRight({
  id,
  isFlippingTo,
  zIndex,
  isFlipped,
  handleFlipEndPage,
}: SheetRightProps) {
  return (
    <div
      onTransitionEnd={handleFlipEndPage}
      className={cn(
        "pageContainer",
        "right",
        isFlippingTo > id ? "rotate-y-180 " : ""
      )}
      style={{
        zIndex: zIndex,
      }}
    >
      <Page id={id + 2} className="page verso">
        {id} verso {isFlipped}
      </Page>
      <Page id={id + 1} className="page recto">
        {id} recto
      </Page>
    </div>
  );
}
export default SheetRight;
