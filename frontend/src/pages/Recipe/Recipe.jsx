import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SearchBar from "../../components/SearchBar/SearchBar";
import { Search } from "lucide-react";
import { variable, Loader } from "../../shared";

function RecipeCard({ recipe }) {
  const navigate = useNavigate();
  function redirectRecipe(id) {
    navigate(`/recipe/${id}`, { state: { recipe } });
  }

  return (
    <div
      onClick={() => redirectRecipe(recipe.idMeal)}
      className="bg-neutral-800 shadow-lg rounded overflow-hidden m-4  w-full lg:w-lg"
    >
      {recipe.strMealThumb && (
        <div className="relative">
          <img
            src={recipe.strMealThumb}
            alt={recipe.strMeal}
            className="w-full h-48 object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-neutral-800 opacity-[90%] bg-opacity-50 text-white p-2">
            <h2 className="text-xl font-bold truncate">{recipe.strMeal}</h2>
          </div>
        </div>
      )}

      <div className="p-2">
        <div className="mb-1">
          <p className="text-neutral-200">
            <strong>Category:</strong> {recipe.strCategory}
          </p>
          <p className="text-neutral-200">
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
    return <Loader />;
  }

  return (
    <div className="flex flex-col h-screen lg:w-full">
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

        <div className="flex flex-wrap justify-center mt-8 mb-20 ">
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
