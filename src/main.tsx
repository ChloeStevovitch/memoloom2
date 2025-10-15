import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./style.css";
import { twMerge } from "tailwind-merge";
import clsx, { type ClassValue } from "clsx";
import { BookProvider } from "./context/bookContext.tsx";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

let container: any = null;

document.addEventListener("DOMContentLoaded", function () {
  if (!container) {
    container = document.getElementById("root") as HTMLElement;
    const root = createRoot(container);
    root.render(
      <BookProvider>
        <>
          <App />
        </>
      </BookProvider>
    );
  }
});
