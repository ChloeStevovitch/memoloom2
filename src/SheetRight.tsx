import { cn } from "./main";
import Page from "./Page";

interface SheetRightProps {
  isFlippingTo: number;
  handleFlipEndPage: () => void;
  children?: React.ReactNode;
  id: number;
  className?: string;
}

function SheetRight({ id, isFlippingTo, handleFlipEndPage }: SheetRightProps) {
  return (
    <div
      onTransitionEnd={handleFlipEndPage}
      className={cn(
        "pageContainer",
        "right",
        isFlippingTo > id ? "rotate-y-180 " : ""
      )}
    >
      <Page id={id + 2} className="page verso">
        {id + 2} verso
      </Page>
      <Page id={id + 1} className="page recto">
        {id + 1} recto
      </Page>
    </div>
  );
}
export default SheetRight;
