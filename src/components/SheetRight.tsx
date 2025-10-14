import { useBook } from "../context/bookContext";
import { PageProvider } from "../context/pageContext";
import { cn } from "../main";
import Page from "./Page";

interface SheetRightProps extends React.HTMLAttributes<HTMLDivElement> {
  zIndex: number;
  isFlipped: boolean;
  isLast?: boolean;
  isFirst?: boolean;
  rectoId: number;
  versoId: number;
}

function SheetRight({
  zIndex,
  isFlipped,
  isFirst,
  isLast,
  rectoId,
  versoId,
  ...props
}: SheetRightProps) {
  const { activeRectoSheet } = useBook();

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
        <PageProvider
          key={`page-provider-${side === "recto" ? rectoId : versoId}`}
        >
          {versoId > 0 && (
            <Page
              key={`page-${side === "recto" ? rectoId : versoId}`}
              visible={
                side === "recto"
                  ? rectoId === activeRectoSheet
                  : versoId === activeRectoSheet - 1
              }
              index={side === "recto" ? rectoId : versoId}
              className={cn("page", side, (isFirst || isLast) && "cover")}
            />
          )}
        </PageProvider>
      ))}
    </div>
  );
}
export default SheetRight;
