import "quill/dist/quill.snow.css";
import { useEffect, useRef, useState } from "react";

import { usePage } from "../context/pageContext";
import { useBook } from "../context/bookContext";
import type { Page as PageType } from "../service/types";
import throttle from "../utils/throttle";
import FabricJSCanvas from "./Canva";
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
  const { flipDirection, setUpdatedPages } = useBook();
  const { fetchPage } = usePage();

  const containerRef = useRef<HTMLDivElement>(null);

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
    if (flipDirection === "right" || flipDirection === "left") {
      console.log("Flip detected in Page component");
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
    setUpdatedPages((prev) =>
      new Map(prev).set(index, JSON.stringify(newCanvasData))
    );
  };
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
