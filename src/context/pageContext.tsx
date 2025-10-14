import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import pageServiceHttp from "../service/pageServiceHttp";
import type { Page } from "../service/types";

interface PageContextType {
  loading: boolean;
  error: string | null;
  setCurrentPage: React.Dispatch<React.SetStateAction<Page | undefined>>;
  currentPage: Page | undefined;
  savedPage: Page | undefined;
  savePage: (index: number) => Promise<void>;
  fetchPage: (index: number) => Promise<void>;
}

const PageContext = createContext<PageContextType | undefined>(undefined);

interface PageProviderProps {
  children: ReactNode;
}

export const PageProvider: React.FC<PageProviderProps> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<Page | undefined>(undefined);
  const [savedPage, setSavedPage] = useState<Page | undefined>(undefined);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPage = async (index: number) => {
    try {
      setLoading(true);
      const data = await pageServiceHttp.getPage(index);
      setSavedPage(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const savePage = async (index: number) => {
    if (currentPage === undefined || index === null) return;
    try {
      setLoading(true);
      await pageServiceHttp.updatePage(index, currentPage);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const value: PageContextType = {
    currentPage,
    savedPage,
    loading,
    error,
    savePage,
    fetchPage,
    setCurrentPage,
  };

  return <PageContext.Provider value={value}>{children}</PageContext.Provider>;
};

export const usePage = (): PageContextType => {
  const context = useContext(PageContext);
  if (context === undefined) {
    throw new Error("usePage must be used within a PageProvider");
  }
  return context;
};
