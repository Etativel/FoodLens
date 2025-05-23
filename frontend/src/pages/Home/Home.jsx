import SearchBar from "../../components/SearchBar/SearchBar";
import foodLensIcon from "../../assets/icons/FoodLensIcon.png";
import { useEffect, useState } from "react";
import { NutrientInfoGraph, FoodContent, variable } from "../../shared";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import UserContext from "../../contexts/createContext/UserContext";

function Home() {
  const navigate = useNavigate();
  const { profile } = useContext(UserContext);
  const [search, setSearch] = useState("");
  const [calories, setCalories] = useState(null);
  const [food, setFood] = useState(null);
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  const currentDate = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
    now.getDate()
  )}`;

  console.log(food);

  useEffect(() => {
    if (!profile) return;
    async function fetchHomeData() {
      try {
        const response = await fetch(`${variable.API_URL}/user/home`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: profile.user.id,
          }),
        });
        if (!response.ok) {
          console.log("Failed to retrieve home data, ", response.statusText);
        }
        const { totals, recipeObject } = await response.json();
        setCalories(totals);
        setFood(recipeObject);
      } catch (err) {
        console.log("internal server error, ", err);
      }
    }
    fetchHomeData();
  }, [profile]);

  function redirectRecipePage() {
    navigate("/recipe");
  }

  function onSubmit() {
    navigate(`/recipe?query=${encodeURIComponent(search)}`);
  }

  return (
    <div className="flex flex-col h-screen w-full">
      <div className="flex flex-col bg-neutral-900 sticky z-10 top-0 h-10 justify-end ">
        <div className="transform translate-y-1/2">
          <SearchBar
            filter={search}
            setFilter={setSearch}
            onSubmit={onSubmit}
          />
        </div>
      </div>

      <div className=" flex-1 overflow-y-auto bg-neutral-900 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -ms-overflow-style:none">
        <div className="flex flex-col pb-20 mt-5 lg:pb-0">
          {calories || food ? (
            // <div className="mt-1">

            <div className=" lg:mx-20">
              <NutrientInfoGraph totals={calories} date={currentDate} />

              <FoodContent foods={food} />
            </div>
          ) : (
            // </div>
            <div className="flex mt-10">
              <div className="h-60 w-full mt-1 mx-3  rounded-sm flex flex-col animate-pulse bg-neutral-800"></div>
            </div>
          )}

          <div className="flex justify-evenly mt-10 mb-10">
            <div
              onClick={redirectRecipePage}
              className="flex flex-col justify-center items-center h-30 w-full lg:mx-20 lg:px-3 mx-3 py-4 bg-neutral-800 text-gray-300 hover:bg-blue-500 hover:text-white drop-shadow-xl hover:shadow-[0_0_16px_rgba(59,130,246,0.5)] rounded-sm transition-colors duration-200"
            >
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

          <div className="h-30  flex justify-center items-center bg-neutral-800 text-white flex-col border-t border-neutral-600 lg:bg-transparent lg:h-26">
            <img className="size-15" src={foodLensIcon} alt="" />
            <p className="text-[#8e8e8e] font-semibold">
              See What’s in Your Food
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
