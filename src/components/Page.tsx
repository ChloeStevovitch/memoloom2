import Quill from "quill";
import "quill/dist/quill.snow.css";
import { useEffect, useRef } from "react";
import { cn } from "../main";

interface PageProps extends React.HTMLAttributes<HTMLDivElement> {
  children: any;
}

function Page({ className, ...props }: PageProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);

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
          placeholder: "Compose an epic...",
          theme: "snow",
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

  return (
    <div className={cn(" h-full w-full flex flex-col", className)} {...props}>
      <div ref={editorRef} className="h-full ">
        {props.children}
      </div>
    </div>
  );
}

export default Page;
