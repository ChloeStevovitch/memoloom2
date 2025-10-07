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
      className={cn("pageContainer ", "right", isFlipped && "rotate-y-180 ")}
      style={{
        zIndex: zIndex,
      }}
    >
      <Page
        id={`page-verso-${JSON.stringify(id)}`}
        className={cn(
          "page verso ",
          isFlipped && selected && "outline-blue-400 outline-2 "
        )}
      >
        {id} verso {isFlipped}
      </Page>
      <Page
        id={`page-recto-${JSON.stringify(id)}`}
        className={cn(
          "page recto ",
          !isFlipped && selected && "outline-2 outline-blue-400  "
        )}
      >
        {id} recto
      </Page>
    </div>
  );
}
export default SheetRight;
