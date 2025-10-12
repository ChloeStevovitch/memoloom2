import Quill from "quill";
import "quill/dist/quill.snow.css";
import { useEffect, useRef } from "react";
import { cn } from "../main";

interface PageProps extends React.HTMLAttributes<HTMLDivElement> {
  content?: string;
}

function Page({ className, content, ...props }: PageProps) {
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

        // Définir le contenu initial si fourni
        if (content && content.length && quillRef.current) {
          quillRef.current.setText(content);
        }
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

  // Effet pour mettre à jour le contenu quand il change
  useEffect(() => {
    if (!!content && content.length && quillRef.current) {
      quillRef.current.setText(content);
    }
  }, [content]);

  return (
    <div className={cn(" h-full w-full flex flex-col", className)} {...props}>
      <div ref={editorRef} className="h-full " />
    </div>
  );
}

export default Page;
