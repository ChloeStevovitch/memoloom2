import SheetRight from "./components/SheetRight";
import Binding from "./components/Binding";
import { useBook } from "./context/bookContext";
import { PageProvider } from "./context/pageContext";
import Button from "./components/Button";

function App() {
  const {
    loading,
    bookLength,
    zIndexTable,
    activeRectoSheet,
    setFlipDirection,
    getCurrentPair,
    getNbSheets,
    getRectoIndexFromSheetId,
    handleSaveBook,
    getVersoIndexFromSheetId,
    saveLoading,
    updatedPages,
    pageInEdition,
    handleAddText,
  } = useBook();

  if (loading) {
    return (
      <div className=" h-full w-full flex items-center justify-center">
        Loading books...
      </div>
    );
  }

  if (!bookLength) {
    return (
      <div className=" h-full w-full flex items-center justify-center">
        No book available
      </div>
    );
  }

  return (
    <div className=" h-full w-full  fixed ">
      <div className="bg-blue-200 fixed top-0 h-[50px] w-full flex items-center px-4">
        <span className="mr-4 flex gap-2">
          <Button
            className="bg-blue-100 p-2 disabled:opacity-50"
            isDisabled={getCurrentPair === 0}
            onClick={() => setFlipDirection("left")}
            variant="secondary"
          >
            go left
          </Button>

          <Button
            className="bg-blue-100 p-2 disabled:opacity-50"
            isDisabled={getCurrentPair === getNbSheets(bookLength) - 1}
            onClick={() => setFlipDirection("right")}
            variant="secondary"
          >
            go right
          </Button>
        </span>
        <span className="text-sm">
          Book: {bookLength} pages - current pair: {getCurrentPair} left sheet :
          {activeRectoSheet - 1} right sheet : {activeRectoSheet} - nb sheets :
          {getNbSheets(bookLength)}
          activeRectoSheet {activeRectoSheet}
        </span>
      </div>
      <div className="desk h-[calc(100%-90px)] top-[90px] fixed w-full "></div>

      <div className="bg-white fixed top-[50px] h-[40px] w-full z-1000">
        <div className="h-full w-full overflow-visible z-50 relative flex items-center justify-end p-4 gap-4">
          <Button
            isDisabled={typeof pageInEdition !== "number"}
            onClick={handleAddText}
            variant="secondary"
            size="sm"
          >
            Add Text
          </Button>
          <Button
            isLoading={saveLoading}
            isDisabled={updatedPages.size === 0}
            onClick={handleSaveBook}
            size="sm"
            variant="success"
          >
            Save Book
          </Button>
        </div>
      </div>
      <div className="sheetContainer absolute top-[calc(50%-650px/2)] left-[50%] ">
        <Binding className="left-[-100px]" />

        {Array.from({ length: getNbSheets(bookLength) - 1 }, (_, index) => (
          <SheetRight
            key={`sheet-${index}`}
            isFirst={index === 0}
            isLast={index === getNbSheets(bookLength) - 2}
            rectoId={getRectoIndexFromSheetId(index)}
            versoId={getVersoIndexFromSheetId(index + 1)}
            zIndex={zIndexTable[index]}
            isFlipped={activeRectoSheet > index * 2}
          />
        ))}
      </div>
      <PageProvider>
        <div
          className=" w-0 h-0 overflow-hidden fixed bottom-[10%]"
          id="hiddenEditorContainer"
        ></div>
      </PageProvider>
    </div>
  );
}

export default App;
