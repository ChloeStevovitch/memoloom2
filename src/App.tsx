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
  };
  useEffect(() => {
    if (isFlippingTo === currentPair) return;
    let newArray1: any = [];
    let newArray2: any = [];

    if (currentPair < isFlippingTo) {
      newArray1 = Array.from({ length: currentPair }, (_, i) => nbSheets - i);
      newArray2 = Array.from(
        { length: nbSheets - currentPair },
        (_, i) => nbSheets + 1 - i
      );
    } else if (currentPair > isFlippingTo) {
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

    console.log(newArray);
    setZIndexTable(newArray);
  }, [isFlippingTo]);

  const handleFlipEndPage = () => {
    setCurrentPair(isFlippingTo);
  };

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
              {Array.from({ length: nbSheets }, (_, index) => (
                <SheetRight
                  key={index}
                  currentPair={currentPair}
                  id={index}
                  zIndex={zIndexTable[index]}
                  isFlipped={currentPair > index}
                  isFlippingTo={isFlippingTo}
                  handleFlipEndPage={handleFlipEndPage}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="bg-green-400 h-full w-[10%]">bar2</div>
      </div>
    </div>
  );
}

export default App;
