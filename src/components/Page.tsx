import { Delta } from "quill";
import "quill/dist/quill.snow.css";
import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "../main";
import { usePage } from "../context/pageContext";
import type { Page as PageType } from "../service/types";
import ReactQuill from "react-quill-new";
import { useBook } from "../context/bookContext";

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
function Page({ className, content, index, visible, ...props }: PageProps) {
  const quillRef = useRef<ReactQuill>(null);
  const quillRefReadOnly = useRef<ReactQuill>(null);
  const { fetchPage, savePage } = usePage();
  const [isReadOnly, setIsReadOnly] = useState(true);
  const [savedPage, setSavedPage] = useState<PageType | undefined>(undefined);
  const [editorIsLoaded, setEditorIsLoaded] = useState<boolean>(false);
  const [readOnlyEditorIsLoaded, setReadOnlyEditorIsLoaded] =
    useState<boolean>(false);
  const { flipDirection } = useBook();

  const emptyModule = useMemo(
    () => ({
      toolbar: false,
    }),
    []
  );
  const formats = useMemo(
    () => [
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
    ],
    []
  );

  const [editorDelta, setEditorDelta] = useState<ReactQuill.Value | undefined>(
    undefined
  );
  const [readOnlyEditorDelta, setReadOnlyEditorDelta] = useState<
    ReactQuill.Value | undefined
  >(undefined);

  const getDelta = (editorRef: React.RefObject<ReactQuill | null>) => {
    if (editorRef.current) {
      const editor = editorRef.current.getEditor();
      return editor.getContents();
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
  const save = async (index: number, page: PageType) => {
    const resp = await savePage(index, page);
    if (resp) {
      setSavedPage(resp);
    }
  };

  const fetch = async (index: number) => {
    const resp = await fetchPage(index);
    if (resp) {
      setSavedPage(resp);
    }
  };

  useEffect(() => {
    if (
      (flipDirection === "right" || flipDirection === "left") &&
      !isReadOnly
    ) {
      handleBlurEvent();
    }
  }, [flipDirection]);

  useEffect(() => {
    if (visible && !savedPage) fetch(index);
  }, [visible]);

  const handleBlurEvent = async () => {
    setEditorIsLoaded(false);
    await save(index, { delta: JSON.stringify(getDelta(quillRef)) });

    setIsReadOnly(true);
  };

  const handleFocusEvent = () => {
    setReadOnlyEditorIsLoaded(false);
    setIsReadOnly(false);
  };

  useEffect(() => {
    if (editorIsLoaded) {
      setDelta(safeJSONParse(savedPage?.delta), quillRef);
      setReadOnlyEditorIsLoaded(false);
    }
  }, [editorIsLoaded]);

  useEffect(() => {
    if (readOnlyEditorIsLoaded) {
      setDelta(
        savedPage ? safeJSONParse(savedPage?.delta) : undefined,
        quillRefReadOnly
      );
      setEditorIsLoaded(false);
    }
  }, [readOnlyEditorIsLoaded]);

  const module = useMemo(
    () => ({
      toolbar: "#toolbar-container",
    }),
    []
  );

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
      {(visible || (!visible && savedPage)) &&
        savedPage &&
        (isReadOnly ? (
          <ReactQuill
            theme="snow"
            ref={(instance) => {
              quillRefReadOnly.current = instance;
              if (instance && !readOnlyEditorIsLoaded) {
                setReadOnlyEditorIsLoaded(true);
              }
            }}
            value={readOnlyEditorDelta}
            modules={emptyModule}
            readOnly={true}
            onChange={setReadOnlyEditorDelta}
            onFocus={handleFocusEvent}
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
              }
            }}
            onChange={setEditorDelta}
            value={editorDelta}
            modules={editorIsLoaded ? module : undefined}
            formats={formats}
            theme="snow"
          />
        ))}
    </div>
  );
}

export default Page;
