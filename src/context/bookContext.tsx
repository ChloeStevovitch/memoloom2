import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import bookServiceHttp, { type Book } from "../service/BookServiceHttp";

interface BookContextType {
  books: Book[] | undefined;
  loading: boolean;
  error: string | null;
}

const BookContext = createContext<BookContextType | undefined>(undefined);

interface BookProviderProps {
  children: ReactNode;
}

export const BookProvider: React.FC<BookProviderProps> = ({ children }) => {
  const [books, setBooks] = useState<Book[] | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      if (books !== undefined || loading) return;
      try {
        setLoading(true);
        const data = await bookServiceHttp.getBooks();
        console.log("Received books from API:", data);
        setBooks(data);
      } catch (err) {
        console.error("Error fetching books:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [books, loading]);

  useEffect(() => {
    console.log("Books updated:", books);
  }, [books]);

  const value: BookContextType = {
    books,
    loading,
    error,
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
