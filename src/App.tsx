import Page from "./Page";

function App() {
  return (
    <div className=" h-screen w-screen flex flex-col">
      <div className="bg-blue-200 h-[5%] w-full">bar</div>
      <div className="h-[95%] flex w-full">
        <div className="bg-purple-400 h-full centerFlex w-[90%] ">
          <div className="h-[80%] centerFlex">
            <div className="bg-red-400 h-full  aspect-3/4">
              <Page />
            </div>
            <div className="bg-yellow-400 h-full w-[50px]"></div>
            <div className="bg-orange-400 h-full aspect-3/4">
              <Page />
            </div>
          </div>
        </div>
        <div className="bg-green-400 h-full w-[10%]">bar2</div>
      </div>
    </div>
  );
}

export default App;
