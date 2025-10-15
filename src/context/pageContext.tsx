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
  savePage: (index: number, page: Page) => Promise<Page | undefined>;
  fetchPage: (index: number) => Promise<Page | undefined>;
}

const PageContext = createContext<PageContextType | undefined>(undefined);

interface PageProviderProps {
  children: ReactNode;
}

export const PageProvider: React.FC<PageProviderProps> = ({ children }) => {
  const [saveLoading, setSaveLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPage = async (index: number) => {
    try {
      setFetchLoading(true);
      const data = await pageServiceHttp.getPage(index);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      return undefined;
    } finally {
      setFetchLoading(false);
    }
  };

  const savePage = async (index: number, page: Page) => {
    if (index === null) return;
    try {
      setSaveLoading(true);
      const data = await pageServiceHttp.updatePage(index, page);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setSaveLoading(false);
    }
  };

  const value: PageContextType = {
    fetchLoading,
    saveLoading,
    error,
    savePage,
    fetchPage,
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
