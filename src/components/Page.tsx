import { Delta } from "quill";
import "quill/dist/quill.snow.css";
import { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill-new";
import { cn } from "../main";
import { usePage } from "../context/pageContext";
import { useBook } from "../context/bookContext";
import type { Page as PageType } from "../service/types";
import throttle from "../utils/throttle";

// Types
interface PageProps extends React.HTMLAttributes<HTMLDivElement> {
  index: number;
  visible: boolean;
}

const TOOLBAR_HTML = `
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

// Utility functions
const createToolbarElement = (): HTMLDivElement => {
  const toolbarDiv = document.createElement("div");
  toolbarDiv.innerHTML = TOOLBAR_HTML;
  return toolbarDiv;
};

const pageConstructor = (delta?: Delta): PageType | undefined => {
  if (!delta) return undefined;
  return { delta: JSON.stringify(delta || new Delta()) };
};

const getDelta = (
  editorRef: React.RefObject<ReactQuill | null>
): Delta | undefined => {
  if (editorRef.current) {
    const editor = editorRef.current.getEditor();
    return editor.getContents();
  }
  return undefined;
};

const safeJSONParse = (jsonString: string | undefined): Delta | undefined => {
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
  delta: Delta | undefined,
  editorRef: React.RefObject<ReactQuill | null>
): void => {
  if (delta && editorRef?.current) {
    const editor = editorRef.current.getEditor();
    editor.setContents(delta);
  }
};

// Normaliser un delta pour la comparaison
const normalizeDelta = (delta: Delta | undefined): string => {
  if (!delta) return "{}";
  // Supprimer les propriétés vides et normaliser la structure
  const normalized = JSON.parse(JSON.stringify(delta));
  return JSON.stringify(normalized);
};
function Page({ className, index, visible, ...props }: PageProps) {
  // Refs
  const quillRef = useRef<ReactQuill>(null);
  const quillRefReadOnly = useRef<ReactQuill>(null);

  // State
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

  // Contexts
  const { flipDirection } = useBook();
  const { fetchPage, savePage } = usePage();

  // Page operations
  const fetchPageData = async (pageIndex: number) => {
    const resp = await fetchPage(pageIndex);
    if (resp) {
      setSavedPage(resp);
      setCurrentPage(resp);
    }
  };

  const savePageData = async (
    pageIndex: number,
    page: PageType | undefined
  ) => {
    if (!page || !savedPage) {
      if (!page) return;
      // Première sauvegarde
    } else {
      // Vérifier si le contenu a réellement changé
      const currentDelta = safeJSONParse(page.delta);
      const savedDelta = safeJSONParse(savedPage.delta);

      // Comparer les deltas normalisés pour éviter les faux positifs
      if (normalizeDelta(currentDelta) === normalizeDelta(savedDelta)) {
        console.log("Aucun changement détecté, sauvegarde ignorée");
        return;
      }
    }

    console.log("Sauvegarde en cours...");
    const resp = await savePage(pageIndex, page);
    if (resp) {
      setSavedPage(resp);
      setCurrentPage(resp);
    }
  };

  // Throttled operations
  const throttledSave = useRef(
    throttle(
      (pageIndex: number, page: PageType | undefined) =>
        savePageData(pageIndex, page),
      1000
    )
  );

  const throttledFetch = useRef(
    throttle((pageIndex: number) => fetchPageData(pageIndex), 1000)
  );

  // Handlers
  const handleSave = () => {
    throttledSave.current(index, currentPage);
  };

  const handleFetch = () => {
    throttledFetch.current(index);
  };

  // Vérifier s'il y a des changements non sauvegardés
  const hasUnsavedChanges = (): boolean => {
    if (!currentPage || !savedPage) {
      return Boolean(currentPage); // Il y a des changements s'il y a du contenu mais rien de sauvé
    }

    const currentDelta = safeJSONParse(currentPage.delta);
    const savedDelta = safeJSONParse(savedPage.delta);

    return normalizeDelta(currentDelta) !== normalizeDelta(savedDelta);
  };

  // Mode switching
  const goToEdit = () => {
    if (!isReadOnly) return;
    setIsReadOnly(false);
  };

  const handleClick = () => {
    if (isReadOnly) {
      goToEdit();
    }
  };

  const goToReadOnly = () => {
    if (isReadOnly) return;
    // Seulement sauvegarder s'il y a des changements
    if (hasUnsavedChanges()) {
      handleSave();
    }
    setIsReadOnly(true);
  };

  // Effects
  useEffect(() => {
    if (flipDirection === "right" || flipDirection === "left") {
      if (!isReadOnly) {
        goToReadOnly();
      } else if (hasUnsavedChanges()) {
        // Sauvegarder seulement s'il y a des changements non sauvegardés
        handleSave();
      }
    }
  }, [flipDirection]);

  useEffect(() => {
    if (visible && !savedPage) {
      handleFetch();
    }
  }, [visible]);

  useEffect(() => {
    if (!quillRef.current) return;
    const content = getDelta(quillRef);
    setCurrentPage(pageConstructor(content));
  }, [editorDeltaValue]);

  useEffect(() => {
    if (!currentPage) return;

    if (readOnlyEditorIsLoaded) {
      setDelta(safeJSONParse(currentPage.delta), quillRefReadOnly);
    } else if (editorIsLoaded) {
      setDelta(safeJSONParse(currentPage.delta), quillRef);
    }
  }, [readOnlyEditorIsLoaded, editorIsLoaded, currentPage]);

  // Focus automatique quand on passe en mode édition
  useEffect(() => {
    if (!isReadOnly && editorIsLoaded && quillRef.current) {
      setTimeout(() => {
        quillRef.current?.focus();
      }, 50);
    }
  }, [isReadOnly, editorIsLoaded]);

  // Ref handlers
  const handleReadOnlyRef = (instance: ReactQuill | null) => {
    quillRefReadOnly.current = instance;
    if (instance && !readOnlyEditorIsLoaded) {
      setReadOnlyEditorIsLoaded(true);
    } else if (!instance && readOnlyEditorIsLoaded) {
      setReadOnlyEditorIsLoaded(false);
    }
  };

  const handleEditableRef = (instance: ReactQuill | null) => {
    quillRef.current = instance;

    if (instance && !editorIsLoaded) {
      const toolbarContainer = document.getElementById("toolbar-container");
      toolbarContainer?.replaceChildren();
      toolbarContainer?.appendChild(createToolbarElement());
      setEditorIsLoaded(true);

      // Focus automatiquement l'éditeur une fois chargé
      setTimeout(() => {
        instance.focus();
      }, 100);
    } else if (!instance && editorIsLoaded) {
      setEditorIsLoaded(false);
    }
  };

  return (
    <div
      className={cn(
        "h-full w-full flex flex-col relative",
        className,
        "visible",
        isReadOnly && "read-only"
      )}
      onClick={handleClick}
      {...props}
    >
      {currentPage &&
        (isReadOnly ? (
          <ReactQuill
            theme="snow"
            ref={handleReadOnlyRef}
            value={editorDeltaValue}
            modules={{ toolbar: false }}
            readOnly={true}
            className="quill-readonly"
          />
        ) : (
          <ReactQuill
            ref={handleEditableRef}
            onChange={setEditorDeltaValue}
            value={editorDeltaValue}
            modules={
              editorIsLoaded ? { toolbar: "#toolbar-container" } : undefined
            }
            theme="snow"
            className="quill-editable"
          />
        ))}
    </div>
  );
}

export default Page;
