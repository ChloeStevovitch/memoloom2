import { useEffect, useRef, useState } from "react";

import { usePage } from "../context/pageContext";
import { useBook } from "../context/bookContext";
import type { Page as PageType } from "../service/types";
import throttle from "../utils/throttle";
import FabricJSCanvas, { type FabricJSCanvasRef } from "./Canva";
import { cn } from "../main";

// Types
interface PageProps extends React.HTMLAttributes<HTMLDivElement> {
  index: number;
  visible: boolean;
}

function Page({ className, index, visible, ...props }: PageProps) {
  // State
  const [savedPage, setSavedPage] = useState<PageType | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState<PageType | undefined>(
    undefined
  );

  // Contexts
  const {
    flipDirection,
    setUpdatedPages,
    setPageInEdition,
    activeRectoSheet,
    registerHandlers,
  } = useBook();
  const { fetchPage } = usePage();

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<FabricJSCanvasRef>(null);

  const fetchPageData = async (pageIndex: number) => {
    const resp = await fetchPage(pageIndex);
    if (resp) {
      setSavedPage(resp);
      setCurrentPage(resp);
    }
  };

  const throttledFetch = useRef(
    throttle((pageIndex: number) => fetchPageData(pageIndex), 1000)
  );

  // Handlers

  const handleFetch = () => {
    throttledFetch.current(index);
  };

  // Effects
  useEffect(() => {
    if (flipDirection === "right") {
      console.log("Flip detected in Page component");
      if (activeRectoSheet > 0) setPageInEdition(activeRectoSheet - 1);
    } else if (flipDirection === "left") {
      setPageInEdition(activeRectoSheet);
    }
  }, [flipDirection]);

  useEffect(() => {
    if (visible && !savedPage) {
      handleFetch();
    }
  }, [visible]);
  const getWidth = () => {
    const element = containerRef.current;
    if (!element) return 0;

    return element.offsetWidth;
  };
  const getHeight = () => {
    const element = containerRef.current;
    if (!element) return 0;

    return element.offsetHeight;
  };
  const handleChange = (newCanvasData: any) => {
    setPageInEdition(index);
    setUpdatedPages((prev) =>
      new Map(prev).set(index, JSON.stringify(newCanvasData))
    );
  };

  // Register this page's addText handler in the context
  useEffect(() => {
    registerHandlers.registerAddTextHandler(index, () =>
      canvasRef.current?.addText()
    );
    registerHandlers.registerAddFullPageTextHandler(index, () =>
      canvasRef.current?.addFullPageText()
    );
  }, [index, registerHandlers, canvasRef]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "h-full w-full flex flex-col relative items-center justify-center",
        className,
        "visible"
      )}
      {...props}
    >
      {savedPage && (
        <FabricJSCanvas
          ref={canvasRef}
          id={"canva + " + index}
          height={getHeight()}
          width={getWidth()}
          defaultValue={savedPage.canva}
          onChange={handleChange}
        />
      )}
    </div>
  );
}

export default Page;
