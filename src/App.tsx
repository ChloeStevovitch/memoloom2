import { useEffect, useState } from "react";
import SheetRight from "./components/SheetRight";
import Binding from "./components/Binding";

function App() {
  const [currentPair, setCurrentPair] = useState<number>(0);
  const nbSheets = 5;
  const [zIndexTable, setZIndexTable] = useState<number[]>(
    Array.from({ length: nbSheets }, (_, i) => nbSheets - i)
  );
  const [flipDirection, setFlipDirection] = useState<"left" | "right" | null>(
    null
  );
  const [selectedSide, setSelectedSide] = useState<"right" | "left" | null>(
    null
  );
  const selectQuill = () => {
    const pageId = `page-verso-${JSON.stringify(currentPair - 1)}`;
    const sheet = document.getElementById(pageId) as any;
    const quill = sheet?.getElementsByClassName("ql-editor")[0];
    if (quill) {
      quill.classList.add("bg-blue-200");
      quill.click();
    }
  };
  useEffect(() => {
    if (selectedSide === "left") {
      selectQuill();
    }
  }, [selectedSide]);
  useEffect(() => {
    setSelectedSide(null);
    if (flipDirection === null) return;
    const direction = flipDirection;

    let newArray1: any = [];
    let newArray2: any = [];

    if (direction === "right") {
      newArray1 = Array.from({ length: currentPair }, (_, i) => nbSheets - i);
      newArray2 = Array.from(
        { length: nbSheets - currentPair },
        (_, i) => nbSheets + 1 - i
      );
    } else if (direction === "left") {
      newArray1 = Array.from(
        { length: currentPair },
        (_, i) => nbSheets + 1 - i
      );
      newArray2 = Array.from(
        { length: nbSheets - currentPair },
        (_, i) => nbSheets - i
      );
    }
    const newArray = [...newArray1.reverse(), ...newArray2];
    setZIndexTable(newArray);
    setCurrentPair((prev) => (direction === "right" ? prev + 1 : prev - 1));
    setFlipDirection(null);
  }, [flipDirection]);

  return (
    <div className=" h-screen w-screen ">
      <div className="bg-blue-200 fixed top-0 h-[50px] w-full flex items-center px-4">
        <span className="mr-4">
          <button
            className="bg-blue-100 p-2 disabled:opacity-50"
            disabled={currentPair === 0}
            onClick={() => setFlipDirection("left")}
          >
            go left
          </button>
          <button
            className="bg-blue-100 p-2 disabled:opacity-50"
            disabled={currentPair === nbSheets}
            onClick={() => setFlipDirection("right")}
          >
            go right
          </button>
        </span>
      </div>
      <div className="h-[calc(100%-50px)] w-full fixed bg-yellow-200 top-[50px] ">
        <div
          className="sheetContainer absolute top-[calc(50%-650px/2)] left-[50%] "
          // onClick={() => {
          //   setSelectedSide("right");
          //   setZIndexTable((prev) => {
          //     const newArray = [...prev];
          //     newArray[currentPair] = newArray[currentPair - 1] + 1;
          //     return newArray;
          //   });
          // }}
        >
          <Binding className="left-[-100px]" />
          {Array.from({ length: nbSheets }, (_, index) => (
            <SheetRight
              key={index}
              selected={
                (selectedSide === "right" && currentPair === index) ||
                (selectedSide === "left" && currentPair - 1 === index)
              }
              id={index}
              zIndex={zIndexTable[index]}
              isFlipped={currentPair > index}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
