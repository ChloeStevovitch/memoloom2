import { cn } from "../main";
import Page from "./Page";

interface SheetRightProps {
  selected: boolean;
  children?: React.ReactNode;
  id: number;
  className?: string;
  zIndex: number;
  isFlipped: boolean;
}

function SheetRight({ id, zIndex, selected, isFlipped }: SheetRightProps) {
  return (
    <div
      className={cn("pageContainer right", isFlipped && "rotate-y-180")}
      style={{
        zIndex,
      }}
    >
      <Page
        id={`page-recto-${id}`}
        className={cn(
          "page recto",
          selected && !isFlipped && "outline-2 outline-blue-400"
        )}
      >
        {id} recto
      </Page>

      <Page
        id={`page-verso-${id}`}
        className={cn(
          "page verso",
          selected && isFlipped && "outline-2 outline-blue-400"
        )}
      >
        {id} verso
      </Page>
    </div>
  );
}
export default SheetRight;
