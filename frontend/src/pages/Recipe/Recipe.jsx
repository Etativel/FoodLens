import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SearchBar from "../../components/SearchBar/SearchBar";
import { Search } from "lucide-react";
import { variable } from "../../shared";

function RecipeCard({ recipe }) {
  const navigate = useNavigate();
  function redirectRecipe(id) {
    navigate(`/recipe/${id}`, { state: { recipe } });
  }

  return (
    <div
      onClick={() => redirectRecipe(recipe.idMeal)}
      className="bg-white shadow-lg rounded overflow-hidden m-4  w-full"
    >
      {recipe.strMealThumb && (
        <div className="relative">
          <img
            src={recipe.strMealThumb}
            alt={recipe.strMeal}
            className="w-full h-48 object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-neutral-800 bg-opacity-50 text-white p-2">
            <h2 className="text-xl font-bold truncate">{recipe.strMeal}</h2>
          </div>
        </div>
      )}

      <div className="p-2">
        <div className="mb-1">
          <p className="text-gray-600">
            <strong>Category:</strong> {recipe.strCategory}
          </p>
          <p className="text-gray-600">
            <strong>Cuisine:</strong> {recipe.strArea}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Recipe() {
  const [filteredData, setFilteredData] = useState([]);
  const [filter, setFilter] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const queryValue = queryParams.get("query");

    if (queryValue) {
      setFilter(queryValue);
      fetchRecipe(queryValue);
    }
  }, [location.search]);

  async function fetchRecipe(query) {
    if (!query) return;
    try {
      setIsFetching(true);
      const response = await fetch(
        `${variable.API_URL}/recipe?search=${encodeURIComponent(query)}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (!response.ok) {
        setIsFetching(false);
        console.log("Failed to retrieve recipe, ", response.statusText);
        return;
      }
      const data = await response.json();
      console.log("this is data", data);
      setFilteredData(data.recipe.meals || []);
      setIsFetching(false);
      console.log(data);
    } catch (err) {
      setIsFetching(false);
      console.log(err);
    }
  }

  const handleSearchSubmit = async () => {
    const newUrl = filter
      ? `/recipe?query=${encodeURIComponent(filter)}`
      : "/recipe";
    navigate(newUrl, { replace: true });
    // await searchRecipe(filter);
    await fetchRecipe(filter);
  };

  if (isFetching) {
    return (
      <div className="h-full w-full flex justify-center items-center">
        <div role="status">
          <svg
            aria-hidden="true"
            className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen lg:max-w-[500px] md:max-w-[500px]">
      <div className="flex-1 overflow-y-auto bg-neutral-900 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -ms-overflow-style:none">
        <div className="flex flex-col bg-neutral-900 sticky z-10 top-0 h-10 justify-end">
          <div className="transform translate-y-1/2">
            <SearchBar
              filter={filter}
              setFilter={setFilter}
              onSubmit={handleSearchSubmit}
              name={"Search for Recipe"}
            />
          </div>
        </div>

        <div className="flex flex-wrap justify-center mt-8 mb-20">
          {filteredData.map((recipe) => (
            <RecipeCard key={recipe.idMeal} recipe={recipe} />
          ))}
        </div>

        {filteredData.length === 0 && (
          <div className="text-white text-center p-4 transform translate-y-20 flex flex-col items-center justify-center">
            <Search size={48} className="text-gray-200 mb-3" />
            <p className="text-lg font-semibold">
              No recipes found. Try another search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
