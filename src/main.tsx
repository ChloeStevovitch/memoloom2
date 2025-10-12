import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./style.css";
import { twMerge } from "tailwind-merge";
import clsx, { type ClassValue } from "clsx";
import { BookProvider } from "./context/bookContext.tsx";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BookProvider>
      <App />
    </BookProvider>
  </StrictMode>
);
