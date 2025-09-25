import { useState } from "react";
import SheetRight from "./SheetRight";
import SheetLeft from "./SheetLeft";

function App() {
  const [isFlippingTo, setIsFlippingTo] = useState<number>(1);
  const [currentPair, setCurrentPair] = useState<number>(1);

  const handleFlip = (value: number) => {
    setIsFlippingTo(value);
  };
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
            <SheetLeft
              id={1}
              isFlippingTo={isFlippingTo}
              handleFlipEndPage={handleFlipEndPage}
            />

            <div className=" w-[200px] absolute h-full   centerFlex">
              <div className="bg-amber-900/80 h-full w-[2px]"></div>
            </div>
            <SheetRight
              id={1}
              isFlippingTo={isFlippingTo}
              handleFlipEndPage={handleFlipEndPage}
            />
          </div>
        </div>
        <div className="bg-green-400 h-full w-[10%]">bar2</div>
      </div>
    </div>
  );
}

export default App;
