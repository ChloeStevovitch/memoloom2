import Quill from "quill";
import "quill/dist/quill.snow.css";
import { useEffect, useRef, useState } from "react";
import { cn } from "../main";
import { usePage } from "../context/pageContext";

interface PageProps extends React.HTMLAttributes<HTMLDivElement> {
  index: number;
  visible: boolean;
}

function Page({ className, content, index, visible, ...props }: PageProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);
  const [quillHasBeenFilled, setQuillHasBeenFilled] = useState(false);
  const { setCurrentPage, savedPage, fetchPage } = usePage();
  if (index === -1) {
    return;
  }
  const updatePage = () => {
    const htmlContent = quillRef.current?.root.innerHTML;
    if (htmlContent !== undefined) {
      setCurrentPage({ html: htmlContent });
    }
  };

  useEffect(() => {
    if (visible && !quillHasBeenFilled) {
      fetchPage(index);
    }
  }, [visible, quillHasBeenFilled]);

  useEffect(() => {
    if (visible && savedPage) {
      fillQuillContent(savedPage.html);
      setQuillHasBeenFilled(true);
    }
  }, [visible, savedPage]);

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
          placeholder: "Write something...",
          theme: "snow",
        });

        quillRef.current.on("text-change", () => {
          updatePage();
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
    }
  };

  return (
    <div className={cn(" h-full w-full flex flex-col", className)} {...props}>
      <div ref={editorRef} className="h-full " />
    </div>
  );
}

export default Page;
