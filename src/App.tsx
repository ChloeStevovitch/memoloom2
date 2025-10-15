import SheetRight from "./components/SheetRight";
import Binding from "./components/Binding";
import { useBook } from "./context/bookContext";
import { PageProvider } from "./context/pageContext";

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
    getVersoIndexFromSheetId,
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
          <button
            className="bg-blue-100 p-2 disabled:opacity-50"
            disabled={getCurrentPair === 0}
            onClick={() => setFlipDirection("left")}
          >
            go left
          </button>
          <button
            className="bg-blue-100 p-2 disabled:opacity-50"
            disabled={getCurrentPair === getNbSheets(bookLength) - 1}
            onClick={() => setFlipDirection("right")}
          >
            go right
          </button>
        </span>
        <span className="text-sm">
          Book: {bookLength} pages - current pair: {getCurrentPair} left sheet :
          {activeRectoSheet - 1} right sheet : {activeRectoSheet} - nb sheets :
          {getNbSheets(bookLength)}
          activeRectoSheet {activeRectoSheet}
        </span>
      </div>
      <div className="bg-white fixed top-[50px] h-[40px] w-full  px-4"></div>
      <div className="desk h-[calc(100%-90px)] top-[90px] fixed w-full "></div>
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
