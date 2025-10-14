import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import bookServiceHttp from "../service/BookServiceHttp";

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
  selectedSide: "right" | "left" | null;
  setSelectedSide: React.Dispatch<
    React.SetStateAction<"right" | "left" | null>
  >;
  getRectoIndexFromSheetId: (sheetId: number) => number;
  getVersoIndexFromSheetId: (sheetId: number) => number;
  getCurrentPair: number;
  getNbSheets: (bookLength: number | undefined) => number;
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
  const [selectedSide, setSelectedSide] = useState<"right" | "left" | null>(
    null
  );

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
  const selectQuill = () => {
    const pageId = `page-verso-${JSON.stringify(activeRectoSheet - 1)}`;
    const sheet = document.getElementById(pageId) as any;
    const quill = sheet?.getElementsByClassName("ql-editor")[0];
    if (quill) {
      quill.click();
    }
  };
  useEffect(() => {
    if (selectedSide === "left") {
      selectQuill();
    }
  }, [selectedSide]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const getRectoIndexFromSheetId = (sheetId: number) => sheetId * 2;
  const getVersoIndexFromSheetId = (sheetId: number) => sheetId * 2 - 1;

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
    setSelectedSide(null);
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
    selectedSide,
    setSelectedSide,
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
