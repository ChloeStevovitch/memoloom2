import Quill from "quill";
import "quill/dist/quill.snow.css";
import { useEffect, useRef, useState } from "react";
import { cn } from "../main";
import { usePage } from "../context/pageContext";
import { useBook } from "../context/bookContext";

interface PageProps extends React.HTMLAttributes<HTMLDivElement> {
  index: number;
  visible: boolean;
}

function Page({ className, content, index, visible, ...props }: PageProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);
  const [quillHasBeenFilled, setQuillHasBeenFilled] = useState(false);
  const { setCurrentPage, savedPage, fetchPage, savePage, currentPage } =
    usePage();
  const { setActivePage } = useBook();
  const updateCurrentPage = () => {
    const htmlContent = quillRef.current?.root.innerHTML;
    if (htmlContent !== undefined) {
      setCurrentPage({ html: htmlContent });
    }
  };
  const save = async (index: number) => {
    const resp = await savePage(index);
    if (resp) {
      fillQuillContent(resp.html);
    }
  };
  const fetch = async (index: number) => {
    const resp = await fetchPage(index);
    if (resp) {
      fillQuillContent(resp.html);
    }
  };

  useEffect(() => {
    if (visible) {
      !quillHasBeenFilled && fetch(index);
    } else {
      quillHasBeenFilled &&
        currentPage?.html !== savedPage?.html &&
        save(index);
    }
  }, [visible, quillHasBeenFilled]);

  useEffect(() => {
    let isCleanedUp = false;
    const initializeQuill = () => {
      if (editorRef.current && !quillRef.current && !isCleanedUp) {
        quillRef.current = new Quill(editorRef.current, {
          modules: {
            toolbar: [
              [{ header: [1, 2, false] }],
              ["bold", "italic", "underline"],
              ["image", "code-block"],
            ],
          },
          theme: "snow",
        });
        const toolbar =
          editorRef.current?.parentElement?.querySelector(".ql-toolbar");
        toolbar?.setAttribute("id", "page-" + index + "-toolbar");
        quillRef.current.on("selection-change", (range) => {
          if (range) {
            setActivePage(index);
          }
        });

        quillRef.current.on("text-change", () => {
          updateCurrentPage();
        });
      }
    };

    const timeoutId = setTimeout(initializeQuill, 0);

    return () => {
      isCleanedUp = true;
      clearTimeout(timeoutId);

      if (quillRef.current) {
        try {
          quillRef.current.disable();
        } catch (error) {}
        quillRef.current = null;
      }
    };
  }, []);

  const fillQuillContent = (content: string = "") => {
    if (!!content && quillRef.current) {
      console.log("Loading content into Quill:", content);
      quillRef.current.root.innerHTML = content;
      setQuillHasBeenFilled(true);
    }
  };

  return (
    <div
      className={cn(
        " h-full w-full flex flex-col",
        className,
        visible && "visible"
      )}
      {...props}
    >
      <div ref={editorRef} className="h-full " />
    </div>
  );
}

export default Page;
