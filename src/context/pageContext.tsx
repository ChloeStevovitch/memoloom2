import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import pageServiceHttp from "../service/pageServiceHttp";
import type { Page } from "../service/types";

interface PageContextType {
  fetchLoading: boolean;
  saveLoading: boolean;
  error: string | null;
  setCurrentPage: React.Dispatch<React.SetStateAction<Page | undefined>>;
  currentPage: Page | undefined;
  savedPage: Page | undefined;
  savePage: (index: number) => Promise<Page | undefined>;
  fetchPage: (index: number) => Promise<Page | undefined>;
}

const PageContext = createContext<PageContextType | undefined>(undefined);

interface PageProviderProps {
  children: ReactNode;
}

export const PageProvider: React.FC<PageProviderProps> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<Page | undefined>(undefined);
  const [savedPage, setSavedPage] = useState<Page | undefined>(undefined);

  const [saveLoading, setSaveLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPage = async (index: number) => {
    try {
      setFetchLoading(true);
      const data = await pageServiceHttp.getPage(index);
      setSavedPage(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      return undefined;
    } finally {
      setFetchLoading(false);
    }
  };

  const savePage = async (index: number) => {
    if (currentPage === undefined || index === null) return;
    try {
      setSaveLoading(true);
      const data = await pageServiceHttp.updatePage(index, currentPage);
      setSavedPage(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setSaveLoading(false);
    }
  };

  const value: PageContextType = {
    currentPage,
    savedPage,
    fetchLoading,
    saveLoading,
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
