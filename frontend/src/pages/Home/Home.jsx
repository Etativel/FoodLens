import SearchBar from "../../components/SearchBar/SearchBard";

function Home() {
  return (
    <div className="flex flex-col  h-screen">
      <div className="flex  bg-blue-300 sticky z-10 top-0 h-10"> </div>
      <div className=" flex-1 overflow-y-auto bg-blue-700     [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -ms-overflow-style:none">
        <div className="flex flex-col gap-1 pb-20">
          <div className="h-24 bg-red-400 flex items-center">
            <SearchBar />
          </div>
          <div className="h-24 bg-red-400">a</div>
          <div className="h-24 bg-red-400">a</div>
          <div className="h-24 bg-red-400">a</div>
          <div className="h-24 bg-red-400">a</div>
          <div className="h-24 bg-red-400">a</div>
          <div className="h-24 bg-red-400">a</div>
          <div className="h-24 bg-red-400">a</div>
          <div className="h-24 bg-red-400">a</div>
          <div className="h-24 bg-red-400">a</div>
          <div className="h-20 bg-yell">asdfghjg</div>
        </div>
      </div>
    </div>
  );
}

export default Home;
