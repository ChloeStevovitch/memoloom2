import { cn } from "../main";
import Page from "./Page";

interface SheetRightProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  zIndex: number;
  isFlipped: boolean;
  isLast?: boolean;
  isFirst?: boolean;
  sheetId: number;
  pageContentRecto?: string;
  pageContentVerso?: string;
}

function SheetRight({
  zIndex,
  isFlipped,
  sheetId,
  isFirst,
  isLast,
  pageContentRecto,
  pageContentVerso,
  ...props
}: SheetRightProps) {
  return (
    <div
      {...props}
      className={cn(
        "pageContainer right",
        isFlipped && "rotate-y-180",
        props.className
      )}
      style={{
        zIndex,
      }}
    >
      {["recto", "verso"].map((side) => (
        <Page
          key={`age-${side}-${sheetId}`}
          className={cn("page", side, (isFirst || isLast) && "cover")}
          content={side === "recto" ? pageContentRecto : pageContentVerso}
        />
      ))}
    </div>
  );
}
export default SheetRight;
