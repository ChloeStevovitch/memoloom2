import { Delta } from "quill";
import "quill/dist/quill.snow.css";
import { useEffect, useRef, useState } from "react";
import { cn } from "../main";
import { usePage } from "../context/pageContext";
import type { Page as PageType } from "../service/types";
import ReactQuill from "react-quill-new";
import { useBook } from "../context/bookContext";
import throttle from "../utils/throttle";

interface PageProps extends React.HTMLAttributes<HTMLDivElement> {
  index: number;
  visible: boolean;
}

const createToolbarElement = () => {
  const toolbarDiv = document.createElement("div");
  toolbarDiv.innerHTML = `
      <select class="ql-font" name="font"></select>
      <select class="ql-size" name="size"></select>
      <button class="ql-bold"></button>
      <button class="ql-italic"></button>
      <button class="ql-underline"></button>
      <button class="ql-strike"></button>
      <select class="ql-color" name="color"></select>
      <select class="ql-background" name="background"></select>
      <button class="ql-header" value="1"></button>
      <button class="ql-header" value="2"></button>
      <button class="ql-blockquote"></button>
      <button class="ql-code-block"></button>
      <button class="ql-list" value="ordered"></button>
      <button class="ql-list" value="bullet"></button>
      <button class="ql-indent" value="-1"></button>
      <button class="ql-indent" value="+1"></button>
      <button class="ql-direction" value="rtl"></button>
      <select class="ql-align" name="align"></select>
      <button class="ql-link"></button>
      <button class="ql-image"></button>
      <button class="ql-video"></button>
      <button class="ql-formula"></button>
      <button class="ql-clean"></button>
  `;
  return toolbarDiv;
};

const formats = [
  "font",
  "size",
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "indent",
  "link",
  "image",
  "video",
  "code-block",
  "table",
  "direction",
  "align",
  "color",
  "background",
];
const pageConstructor = (delta?: Delta): PageType | undefined => {
  if (!delta) return undefined;
  return { delta: JSON.stringify(delta || new Delta()) };
};

const getDelta = (editorRef: React.RefObject<ReactQuill | null>) => {
  if (editorRef.current) {
    const editor = editorRef.current.getEditor();
    return editor.getContents();
  }
};
const safeJSONParse = (jsonString: string | undefined): any => {
  if (!jsonString || jsonString.trim() === "") {
    return undefined;
  }
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    return undefined;
  }
};
const setDelta = (
  delta: Delta,
  editorRef: React.RefObject<ReactQuill | null>
) => {
  if (editorRef && editorRef.current) {
    const editor = editorRef.current.getEditor();
    editor.setContents(delta);
  }
};
function Page({ className, content, index, visible, ...props }: PageProps) {
  const quillRef = useRef<ReactQuill>(null);
  const quillRefReadOnly = useRef<ReactQuill>(null);
  const [isReadOnly, setIsReadOnly] = useState(true);
  const [savedPage, setSavedPage] = useState<PageType | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState<PageType | undefined>(
    pageConstructor()
  );
  const [editorIsLoaded, setEditorIsLoaded] = useState(false);
  const [readOnlyEditorIsLoaded, setReadOnlyEditorIsLoaded] = useState(false);
  const [editorDeltaValue, setEditorDeltaValue] = useState<
    ReactQuill.Value | undefined
  >(undefined);
  const { flipDirection } = useBook();
  const { fetchPage, savePage } = usePage();

  const save = async (index: number, page: PageType | undefined) => {
    if (!page || page.delta === savedPage?.delta) {
      return;
    }
    const resp = await savePage(index, page);
    if (resp) {
      setSavedPage(resp);
      setCurrentPage(resp);
    }
  };
  const throttledSave = useRef(
    throttle(
      (pageIndex: number, page: PageType | undefined) => save(pageIndex, page),
      1000
    )
  );
  const handleSave = () => {
    throttledSave.current(index, currentPage);
  };
  const throttledFetch = useRef(
    throttle((pageIndex: number) => fetch(pageIndex), 1000)
  );
  const handleFetch = () => {
    throttledFetch.current(index);
  };
  const fetch = async (index: number) => {
    const resp = await fetchPage(index);
    if (resp) {
      setSavedPage(resp);
      setCurrentPage(resp);
    }
  };

  useEffect(() => {
    if (flipDirection === "right" || flipDirection === "left") {
      goToReadOnly();
    }
  }, [flipDirection]);

  useEffect(() => {
    if (visible && !savedPage) {
      handleFetch();
    }
  }, [visible]);

  const goToEdit = () => {
    if (!isReadOnly) {
      return;
    }
    setIsReadOnly(false);
  };

  const goToReadOnly = () => {
    if (isReadOnly) {
      return;
    }
    handleSave();
    setIsReadOnly(true);
  };

  useEffect(() => {
    if (!quillRef.current) return;
    const content = getDelta(quillRef);
    setCurrentPage(pageConstructor(content));
  }, [editorDeltaValue, quillRef]);

  useEffect(() => {
    if (!currentPage) {
      return;
    }
    if (readOnlyEditorIsLoaded) {
      setDelta(safeJSONParse(currentPage?.delta), quillRefReadOnly);
    } else if (editorIsLoaded) {
      setDelta(safeJSONParse(currentPage?.delta), quillRef);
    }
  }, [readOnlyEditorIsLoaded, editorIsLoaded, currentPage]);

  return (
    <div
      className={cn(
        " h-full w-full flex flex-col",
        className,
        "visible",
        isReadOnly && "read-only"
      )}
      {...props}
    >
      {currentPage &&
        (isReadOnly ? (
          <ReactQuill
            theme="snow"
            ref={(instance) => {
              quillRefReadOnly.current = instance;
              if (instance && !readOnlyEditorIsLoaded) {
                setReadOnlyEditorIsLoaded(true);
              } else if (!instance && readOnlyEditorIsLoaded) {
                setReadOnlyEditorIsLoaded(false);
              }
            }}
            value={editorDeltaValue}
            modules={{
              toolbar: false,
            }}
            readOnly={true}
            onFocus={goToEdit}
          />
        ) : (
          <ReactQuill
            id="Quill"
            ref={(instance) => {
              quillRef.current = instance;

              if (instance && !editorIsLoaded) {
                document.getElementById("toolbar-container")?.replaceChildren();
                document
                  .getElementById("toolbar-container")
                  ?.appendChild(createToolbarElement());
                setEditorIsLoaded(true);
              } else if (!instance && editorIsLoaded) {
                setEditorIsLoaded(false);
              }
            }}
            onChange={setEditorDeltaValue}
            value={editorDeltaValue}
            modules={
              editorIsLoaded
                ? {
                    toolbar: "#toolbar-container",
                  }
                : undefined
            }
            formats={formats}
            theme="snow"
          />
        ))}
    </div>
  );
}

export default Page;
