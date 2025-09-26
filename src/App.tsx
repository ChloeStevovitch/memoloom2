import { useEffect, useState } from "react";
import SheetRight from "./components/SheetRight";
import Binding from "./components/Binding";

function App() {
  const [isFlippingTo, setIsFlippingTo] = useState<number>(0);
  const [currentPair, setCurrentPair] = useState<number>(0);
  const [zIndexTable, setZIndexTable] = useState<number[]>([5, 4, 3, 2, 1]);
  const nbSheets = 5;

  const handleFlip = (value: number) => {
    setIsFlippingTo(value);
    const oldArray = zIndexTable;
    let newArray1: any = [];
    let newArray2: any = [];

    //on va vers la droite
    if (currentPair < value) {
      // newArray[currentPair] = nbSheets + 1;
      newArray1 = oldArray.slice(0, currentPair).map((_x, i) => nbSheets - i);
      newArray2 = oldArray.slice(currentPair).map((_x, i) => nbSheets + 1 - i);

      //on va vers la gauche
    } else if (currentPair > value) {
      // newArray[currentPair - 1] = nbSheets + 1;
      newArray1 = oldArray
        .slice(0, currentPair)
        .map((_x, i) => nbSheets + 1 - i);
      newArray2 = oldArray.slice(currentPair).map((_x, i) => nbSheets - i);
    }
    const newArray = [...newArray1.reverse(), ...newArray2];

    console.log(newArray);
    setZIndexTable(newArray);
  };

  const handleFlipEndPage = () => {
    setCurrentPair(isFlippingTo);
  };
  useEffect(() => {}, [setIsFlippingTo]);
  return (
    <div className=" h-screen w-screen flex flex-col">
      <div className="bg-blue-200 h-[5%] w-full flex items-center px-4">
        <span className="mr-4">
          <button
            className="bg-blue-100 p-2"
            onClick={() => handleFlip(currentPair - 1)}
          >
            go left
          </button>
          <button
            className="bg-blue-100 p-2"
            onClick={() => handleFlip(currentPair + 1)}
          >
            go right
          </button>
        </span>
      </div>
      <div className="h-[95%] flex w-full">
        <div className="bg-purple-400 h-full centerFlex w-[90%] ">
          <div className="h-[80%] centerFlex relative">
            <div className="sheetContainer"></div>
            <Binding />
            <div className="sheetContainer">
              // PURPLE
              <SheetRight
                currentPair={currentPair}
                id={0}
                zIndex={zIndexTable[0]}
                isFlipped={currentPair > 0}
                isFlippingTo={isFlippingTo}
                handleFlipEndPage={handleFlipEndPage}
              />
              // GREEN
              <SheetRight
                currentPair={currentPair}
                id={1}
                zIndex={zIndexTable[1]}
                isFlipped={currentPair > 1}
                isFlippingTo={isFlippingTo}
                handleFlipEndPage={handleFlipEndPage}
              />
              // YELLOW
              <SheetRight
                currentPair={currentPair}
                id={2}
                zIndex={zIndexTable[2]}
                isFlipped={currentPair > 2}
                isFlippingTo={isFlippingTo}
                handleFlipEndPage={handleFlipEndPage}
              />
              // ORANGE
              <SheetRight
                currentPair={currentPair}
                id={3}
                zIndex={zIndexTable[3]}
                isFlipped={currentPair > 3}
                isFlippingTo={isFlippingTo}
                handleFlipEndPage={handleFlipEndPage}
              />
              //TURQUOISE
              <SheetRight
                currentPair={currentPair}
                id={4}
                zIndex={zIndexTable[4]}
                isFlipped={currentPair > 4}
                isFlippingTo={isFlippingTo}
                handleFlipEndPage={handleFlipEndPage}
              />
            </div>
          </div>
        </div>
        <div className="bg-green-400 h-full w-[10%]">bar2</div>
      </div>
    </div>
  );
}

export default App;
