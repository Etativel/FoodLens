import SearchBar from "../../components/SearchBar/SearchBar";

function Home() {
  return (
    <div className="flex flex-col  h-screen">
      <div className="flex flex-col bg-neutral-900 sticky z-10 top-0 h-20 justify-end ">
        {/* <div className="h-40 w-40 transform -translate-y-20 translate-x-6 bg-blue-200 opacity-40 absolute right-0 top-0 rounded-full"></div>
        <div className="h-25 w-25 transform translate-y-5 translate-x-15 bg-blue-200 opacity-40 absolute right-0 top-0 rounded-full"></div> */}
        <div className="bg-neutral-800 z-10 mb-auto flex justify-between">
          <div>Location</div>
          <div>Lang</div>
        </div>
        <div className="transform translate-y-1/2 ">
          <SearchBar />
        </div>
      </div>

      <div className=" flex-1 overflow-y-auto bg-neutral-900 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -ms-overflow-style:none">
        <div className="flex flex-col gap-1 pb-20">
          <div className="flex justify-evenly mt-15 mb-10">
            <div className="flex flex-col justify-center items-center h-20 w-24 bg-neutral-800 text-gray-300 hover:bg-blue-500 hover:text-white drop-shadow-xl hover:shadow-[0_0_16px_rgba(59,130,246,0.5)] rounded-sm transition-colors duration-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="#b388ff"
                className="h-8 w-8"
              >
                <path d="M12 9a3.75 3.75 0 1 0 0 7.5A3.75 3.75 0 0 0 12 9Z" />
                <path
                  fillRule="evenodd"
                  d="M9.344 3.071a49.52 49.52 0 0 1 5.312 0c.967.052 1.83.585 2.332 1.39l.821 1.317c.24.383.645.643 1.11.71.386.054.77.113 1.152.177 1.432.239 2.429 1.493 2.429 2.909V18a3 3 0 0 1-3 3h-15a3 3 0 0 1-3-3V9.574c0-1.416.997-2.67 2.429-2.909.382-.064.766-.123 1.151-.178a1.56 1.56 0 0 0 1.11-.71l.822-1.315a2.942 2.942 0 0 1 2.332-1.39ZM6.75 12.75a5.25 5.25 0 1 1 10.5 0 5.25 5.25 0 0 1-10.5 0Zm12-1.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
                  clipRule="evenodd"
                />
              </svg>

              <p className="font-semibold text-md text-natural-400">Scan</p>
            </div>
            <div className="flex flex-col justify-center items-center h-20 w-24 bg-neutral-800 text-gray-300 hover:bg-blue-500 hover:text-white drop-shadow-xl hover:shadow-[0_0_16px_rgba(59,130,246,0.5)] rounded-sm transition-colors duration-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="#feae30"
                className="size-6"
              >
                <path
                  fillRule="evenodd"
                  d="M6.32 1.827a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V19.5a3 3 0 0 1-3 3H6.75a3 3 0 0 1-3-3V4.757c0-1.47 1.073-2.756 2.57-2.93ZM7.5 11.25a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H8.25a.75.75 0 0 1-.75-.75v-.008Zm.75 1.5a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H8.25Zm-.75 3a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H8.25a.75.75 0 0 1-.75-.75v-.008Zm.75 1.5a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75V18a.75.75 0 0 0-.75-.75H8.25Zm1.748-6a.75.75 0 0 1 .75-.75h.007a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75h-.007a.75.75 0 0 1-.75-.75v-.008Zm.75 1.5a.75.75 0 0 0-.75.75v.008c0 .414.335.75.75.75h.007a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75h-.007Zm-.75 3a.75.75 0 0 1 .75-.75h.007a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75h-.007a.75.75 0 0 1-.75-.75v-.008Zm.75 1.5a.75.75 0 0 0-.75.75v.008c0 .414.335.75.75.75h.007a.75.75 0 0 0 .75-.75V18a.75.75 0 0 0-.75-.75h-.007Zm1.754-6a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75h-.008a.75.75 0 0 1-.75-.75v-.008Zm.75 1.5a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75h-.008Zm-.75 3a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75h-.008a.75.75 0 0 1-.75-.75v-.008Zm.75 1.5a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75V18a.75.75 0 0 0-.75-.75h-.008Zm1.748-6a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75h-.008a.75.75 0 0 1-.75-.75v-.008Zm.75 1.5a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75h-.008Zm-8.25-6A.75.75 0 0 1 8.25 6h7.5a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-.75.75h-7.5a.75.75 0 0 1-.75-.75v-.75Zm9 9a.75.75 0 0 0-1.5 0V18a.75.75 0 0 0 1.5 0v-2.25Z"
                  clipRule="evenodd"
                />
              </svg>

              <p className="font-semibold text-md">Calories</p>
            </div>
            <div className="flex flex-col justify-center items-center h-20 w-24 bg-neutral-800 text-gray-300 hover:bg-blue-500 hover:text-white drop-shadow-xl hover:shadow-[0_0_16px_rgba(59,130,246,0.5)] rounded-sm transition-colors duration-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="#30bf85"
                className="h-8 w-8"
              >
                <path d="M7.5 3.375c0-1.036.84-1.875 1.875-1.875h.375a3.75 3.75 0 0 1 3.75 3.75v1.875C13.5 8.161 14.34 9 15.375 9h1.875A3.75 3.75 0 0 1 21 12.75v3.375C21 17.16 20.16 18 19.125 18h-9.75A1.875 1.875 0 0 1 7.5 16.125V3.375Z" />
                <path d="M15 5.25a5.23 5.23 0 0 0-1.279-3.434 9.768 9.768 0 0 1 6.963 6.963A5.23 5.23 0 0 0 17.25 7.5h-1.875A.375.375 0 0 1 15 7.125V5.25ZM4.875 6H6v10.125A3.375 3.375 0 0 0 9.375 19.5H16.5v1.125c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 0 1 3 20.625V7.875C3 6.839 3.84 6 4.875 6Z" />
              </svg>

              <p className="font-semibold text-md">Recipes</p>
            </div>
          </div>
          <div className=" mx-3 flex flex-col ">
            <span className="text-lg font-semibold text-white">
              Trending Recipes
            </span>
            <div className="overflow-x-auto whitespace-nowrap mt-2 mb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -ms-overflow-style:none ">
              <div className="inline-block mx-1">
                <div className="bg-transparent rounded-sm h-40 w-50 flex flex-col justify-end overflow-hidden">
                  <div className="h-full w-full">
                    <img
                      src="https://www.allrecipes.com/thmb/SbPEC3DrpMgxVWzVw2yf1-aEOjU=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/11699665-meat-lovers-cheddar-biscuit-sandwich-4x3-6f9dd7c9e0194501ab8ff8a346eb0d30.jpg"
                      alt="Fried rice"
                      className="h-full w-full object-cover rounded-t-sm"
                    />
                  </div>

                  <div className="bg-neutral-800 text-white pl-2 font-semibold py-1 rounded-b-sm">
                    Fried rice
                  </div>
                </div>
              </div>

              <div className="inline-block mx-1">
                <div className="bg-transparent rounded-sm h-40 w-50 flex flex-col justify-end overflow-hidden">
                  <div className="h-full w-full">
                    <img
                      src="https://www.allrecipes.com/thmb/SbPEC3DrpMgxVWzVw2yf1-aEOjU=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/11699665-meat-lovers-cheddar-biscuit-sandwich-4x3-6f9dd7c9e0194501ab8ff8a346eb0d30.jpg"
                      alt="Fried rice"
                      className="h-full w-full object-cover rounded-t-sm"
                    />
                  </div>

                  <div className="bg-neutral-800 text-white pl-2 font-semibold py-1 rounded-b-sm">
                    Fried rice
                  </div>
                </div>
              </div>
              <div className="inline-block mx-1">
                <div className="bg-transparent rounded-sm h-40 w-50 flex flex-col justify-end overflow-hidden">
                  <div className="h-full w-full">
                    <img
                      src="https://www.allrecipes.com/thmb/SbPEC3DrpMgxVWzVw2yf1-aEOjU=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/11699665-meat-lovers-cheddar-biscuit-sandwich-4x3-6f9dd7c9e0194501ab8ff8a346eb0d30.jpg"
                      alt="Fried rice"
                      className="h-full w-full object-cover rounded-t-sm"
                    />
                  </div>

                  <div className="bg-neutral-800 text-white pl-2 font-semibold py-1 rounded-b-sm">
                    Fried rice
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className=" mx-3 flex flex-col mt-5">
            <span className="text-lg font-semibold text-white">
              Your Local Food
            </span>
            <div className="overflow-x-auto whitespace-nowrap mt-2 mb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -ms-overflow-style:none">
              <div className="inline-block mx-1">
                <div className="bg-transparent rounded-sm h-40 w-50 flex flex-col justify-end overflow-hidden">
                  <div className="h-full w-full">
                    <img
                      src="https://www.allrecipes.com/thmb/SbPEC3DrpMgxVWzVw2yf1-aEOjU=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/11699665-meat-lovers-cheddar-biscuit-sandwich-4x3-6f9dd7c9e0194501ab8ff8a346eb0d30.jpg"
                      alt="Fried rice"
                      className="h-full w-full object-cover rounded-t-sm"
                    />
                  </div>

                  <div className="bg-neutral-800 text-white pl-2 font-semibold py-1 rounded-b-sm">
                    Fried rice
                  </div>
                </div>
              </div>

              <div className="inline-block mx-1">
                <div className="bg-transparent rounded-sm h-40 w-50 flex flex-col justify-end overflow-hidden">
                  <div className="h-full w-full">
                    <img
                      src="https://www.allrecipes.com/thmb/SbPEC3DrpMgxVWzVw2yf1-aEOjU=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/11699665-meat-lovers-cheddar-biscuit-sandwich-4x3-6f9dd7c9e0194501ab8ff8a346eb0d30.jpg"
                      alt="Fried rice"
                      className="h-full w-full object-cover rounded-t-sm"
                    />
                  </div>

                  <div className="bg-neutral-800 text-white pl-2 font-semibold py-1 rounded-b-sm">
                    Fried rice
                  </div>
                </div>
              </div>
              <div className="inline-block mx-1">
                <div className="bg-transparent rounded-sm h-40 w-50 flex flex-col justify-end overflow-hidden">
                  <div className="h-full w-full">
                    <img
                      src="https://www.allrecipes.com/thmb/SbPEC3DrpMgxVWzVw2yf1-aEOjU=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/11699665-meat-lovers-cheddar-biscuit-sandwich-4x3-6f9dd7c9e0194501ab8ff8a346eb0d30.jpg"
                      alt="Fried rice"
                      className="h-full w-full object-cover rounded-t-sm"
                    />
                  </div>

                  <div className="bg-neutral-800 text-white pl-2 font-semibold py-1 rounded-b-sm">
                    Fried rice
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className=" mx-3 flex flex-col mt-5">
            <span className="text-lg font-semibold text-white">Topics</span>
            <div className="overflow-x-auto whitespace-nowrap mt-2 mb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -ms-overflow-style:none">
              <div className="inline-block mx-1">
                <div className="bg-transparent rounded-sm h-40 w-50 flex flex-col justify-end overflow-hidden">
                  <div className="h-full w-full">
                    <img
                      src="https://www.allrecipes.com/thmb/SbPEC3DrpMgxVWzVw2yf1-aEOjU=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/11699665-meat-lovers-cheddar-biscuit-sandwich-4x3-6f9dd7c9e0194501ab8ff8a346eb0d30.jpg"
                      alt="Fried rice"
                      className="h-full w-full object-cover rounded-t-sm"
                    />
                  </div>

                  <div className="bg-neutral-800 text-white pl-2 font-semibold py-1 rounded-b-sm">
                    Fried rice
                  </div>
                </div>
              </div>

              <div className="inline-block mx-1">
                <div className="bg-transparent rounded-sm h-40 w-50 flex flex-col justify-end overflow-hidden">
                  <div className="h-full w-full">
                    <img
                      src="https://www.allrecipes.com/thmb/SbPEC3DrpMgxVWzVw2yf1-aEOjU=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/11699665-meat-lovers-cheddar-biscuit-sandwich-4x3-6f9dd7c9e0194501ab8ff8a346eb0d30.jpg"
                      alt="Fried rice"
                      className="h-full w-full object-cover rounded-t-sm"
                    />
                  </div>

                  <div className="bg-neutral-800 text-white pl-2 font-semibold py-1 rounded-b-sm">
                    Fried rice
                  </div>
                </div>
              </div>
              <div className="inline-block mx-1">
                <div className="bg-transparent rounded-sm h-40 w-50 flex flex-col justify-end overflow-hidden">
                  <div className="h-full w-full">
                    <img
                      src="https://www.allrecipes.com/thmb/SbPEC3DrpMgxVWzVw2yf1-aEOjU=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/11699665-meat-lovers-cheddar-biscuit-sandwich-4x3-6f9dd7c9e0194501ab8ff8a346eb0d30.jpg"
                      alt="Fried rice"
                      className="h-full w-full object-cover rounded-t-sm"
                    />
                  </div>

                  <div className="bg-neutral-800 text-white pl-2 font-semibold py-1 rounded-b-sm">
                    Fried rice
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="h-20 bg-yellow-500 text-white">Know More</div>
        </div>
      </div>
    </div>
  );
}

export default Home;
