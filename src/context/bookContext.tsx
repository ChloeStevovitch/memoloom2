import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import bookServiceHttp from "../service/bookServiceHttp";
import pageServiceHttp from "../service/pageServiceHttp";

interface BookContextType {
  bookLength: number | undefined;
  loading: boolean;
  error: string | null;
  zIndexTable: number[];
  activeRectoSheet: number;
  setActiveRectoSheet: React.Dispatch<React.SetStateAction<number>>;
  flipDirection: "left" | "right" | null;
  setFlipDirection: React.Dispatch<
    React.SetStateAction<"left" | "right" | null>
  >;
  pageInEdition: number | null;
  setPageInEdition: React.Dispatch<React.SetStateAction<number | null>>;
  getRectoIndexFromSheetId: (sheetId: number) => number;
  getVersoIndexFromSheetId: (sheetId: number) => number;
  getCurrentPair: number;
  getNbSheets: (bookLength: number | undefined) => number;
  updatedPages: Map<number, string>;
  setUpdatedPages: React.Dispatch<React.SetStateAction<Map<number, string>>>;
  handleSaveBook: () => Promise<void>;
  saveLoading: boolean;
  handleAddText: () => void;
  registerAddTextHandler: (pageIndex: number, handler: () => void) => void;
}

const BookContext = createContext<BookContextType | undefined>(undefined);

interface BookProviderProps {
  children: ReactNode;
}

export const BookProvider: React.FC<BookProviderProps> = ({ children }) => {
  const [bookLength, setBookLength] = useState<number | undefined>(undefined);
  const [activeRectoSheet, setActiveRectoSheet] = useState<number>(0);
  const [zIndexTable, setZIndexTable] = useState<number[]>([]);
  const [flipDirection, setFlipDirection] = useState<"left" | "right" | null>(
    null
  );
  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  const [pageInEdition, setPageInEdition] = useState<number | null>(null);
  const getCurrentPair = useMemo(
    () => activeRectoSheet / 2,
    [activeRectoSheet]
  );
  const getNbSheets = (bookLength: number | undefined) => {
    if (!bookLength) return 0;
    if (bookLength % 2 === 0) {
      return bookLength / 2 + 1;
    } else {
      return Math.floor(bookLength / 2) + 2;
    }
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const getRectoIndexFromSheetId = (sheetId: number) => sheetId * 2;
  const getVersoIndexFromSheetId = (sheetId: number) => sheetId * 2 - 1;
  const [updatedPages, setUpdatedPages] = useState<Map<number, string>>(
    new Map()
  );

  // Store handlers for each page's addText function
  const addTextHandlersRef = React.useRef<Map<number, () => void>>(new Map());

  const handleSaveBook = async () => {
    setSaveLoading(true);
    for (const [pageIndex, canvasData] of updatedPages) {
      try {
        await pageServiceHttp.updatePage(pageIndex, { canva: canvasData });
        console.log(`Page ${pageIndex} saved successfully.`);
        updatedPages.delete(pageIndex);
      } catch (error) {
        console.error(`Error saving page ${pageIndex}:`, error);
      } finally {
        setSaveLoading(false);
      }
    }
  };

  const fetchBookLength = useCallback(async () => {
    try {
      setLoading(true);
      const data = await bookServiceHttp.getBookLength();
      setBookLength(data);

      setZIndexTable(
        Array.from(
          { length: getNbSheets(data) },
          (_, i) => getNbSheets(data) - i
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookLength();
  }, [fetchBookLength]);

  useEffect(() => {
    if (flipDirection === null) return;

    const direction = flipDirection;

    let newArray1: any = [];
    let newArray2: any = [];

    if (direction === "right") {
      newArray1 = Array.from(
        { length: getCurrentPair },
        (_, i) => getNbSheets(bookLength) - i
      );
      newArray2 = Array.from(
        { length: getNbSheets(bookLength) - getCurrentPair },
        (_, i) => getNbSheets(bookLength) + 1 - i
      );
    } else if (direction === "left") {
      newArray1 = Array.from(
        { length: getCurrentPair },
        (_, i) => getNbSheets(bookLength) + 1 - i
      );
      newArray2 = Array.from(
        { length: getNbSheets(bookLength) - getCurrentPair },
        (_, i) => getNbSheets(bookLength) - i
      );
    }
    const newArray = [...newArray1.reverse(), ...newArray2];
    setZIndexTable(newArray);

    setActiveRectoSheet((prev) =>
      direction === "right" ? prev + 2 : prev - 2
    );
    setFlipDirection(null);
  }, [flipDirection]);

  // Register a page's addText handler
  const registerAddTextHandler = useCallback(
    (pageIndex: number, handler: () => void) => {
      addTextHandlersRef.current.set(pageIndex, handler);
    },
    []
  );

  // Call the addText handler for the page currently in edition
  const handleAddText = useCallback(() => {
    if (typeof pageInEdition == "number") {
      const handler = addTextHandlersRef.current.get(pageInEdition);
      if (handler) {
        handler();
      } else {
        console.warn(`No addText handler registered for page ${pageInEdition}`);
      }
    } else {
      console.warn("No page currently in edition");
    }
  }, [pageInEdition]);

  const value: BookContextType = {
    loading,
    error,
    bookLength,
    activeRectoSheet,
    setActiveRectoSheet,
    zIndexTable,
    getRectoIndexFromSheetId,
    getVersoIndexFromSheetId,
    getCurrentPair,
    flipDirection,
    getNbSheets,
    setFlipDirection,
    pageInEdition,
    setPageInEdition,
    updatedPages,
    setUpdatedPages,
    handleSaveBook,
    saveLoading,
    handleAddText,
    registerAddTextHandler,
  };

  return <BookContext.Provider value={value}>{children}</BookContext.Provider>;
};

export const useBook = (): BookContextType => {
  const context = useContext(BookContext);
  if (context === undefined) {
    throw new Error("useBook must be used within a BookProvider");
  }
  return context;
};
