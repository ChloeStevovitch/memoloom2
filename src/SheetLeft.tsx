import { cn } from "./main";
import Page from "./Page";

interface SheetLeftProps {
  isFlippingTo: number;
  handleFlipEndPage: () => void;
  children?: React.ReactNode;
  id: number;
  className?: string;
}

function SheetLeft({ id, isFlippingTo, handleFlipEndPage }: SheetLeftProps) {
  return (
    <div
      onTransitionEnd={handleFlipEndPage}
      className={cn(
        "pageContainer",
        "left",
        isFlippingTo < id ? "rotate-y-180" : ""
      )}
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
