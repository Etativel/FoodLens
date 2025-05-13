import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../../components/SearchBar/SearchBar";

function RecipeCard({ recipe }) {
  const ingredients = Object.keys(recipe)
    .filter((key) => key.startsWith("strIngredient") && recipe[key])
    .map((ingredientKey, index) => ({
      name: recipe[ingredientKey],
      measure: recipe[`strMeasure${index + 1}`] || "",
    }))
    .filter((ing) => ing.name.trim() !== "");

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden m-4 max-w-sm">
      {recipe.strMealThumb && (
        <div className="relative">
          <img
            src={recipe.strMealThumb}
            alt={recipe.strMeal}
            className="w-full h-48 object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
            <h2 className="text-xl font-bold truncate">{recipe.strMeal}</h2>
          </div>
        </div>
      )}

      <div className="p-4">
        <div className="mb-2">
          <p className="text-gray-600">
            <strong>Category:</strong> {recipe.strCategory}
          </p>
          <p className="text-gray-600">
            <strong>Cuisine:</strong> {recipe.strArea}
          </p>
        </div>

        <div className="mb-2">
          <h3 className="text-lg font-semibold mb-1">Key Ingredients</h3>
          <ul className="text-sm text-gray-700 list-disc list-inside">
            {ingredients.slice(0, 3).map((ing, index) => (
              <li key={index}>
                {ing.name} - {ing.measure}
              </li>
            ))}
            {ingredients.length > 3 && (
              <li className="text-gray-500">... and more</li>
            )}
          </ul>
        </div>

        <div className="flex justify-between items-center mt-4">
          {(recipe.strYoutube || recipe.strSource) && (
            <div className="flex space-x-2">
              {recipe.strYoutube && (
                <a
                  href={recipe.strYoutube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm"
                >
                  Watch Video
                </a>
              )}
              {recipe.strSource && (
                <a
                  href={recipe.strSource}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm"
                >
                  Source
                </a>
              )}
            </div>
          )}
          <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Recipe() {
  const [filteredData, setFilteredData] = useState([]);
  const [filter, setFilter] = useState("");
  const navigate = useNavigate();

  async function searchRecipe(query) {
    if (!query) return;
    try {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
      );
      if (!response.ok) {
        console.log("Failed to retrieve data,", response.statusText);
        return;
      }
      const data = await response.json();
      setFilteredData(data.meals || []);
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  }

  const handleSearchSubmit = async () => {
    if (location.pathname !== "/recipe") {
      navigate("/recipe");
    }
    await searchRecipe(filter);
  };

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

        <div className="flex flex-wrap justify-center">
          {filteredData.map((recipe) => (
            <RecipeCard key={recipe.idMeal} recipe={recipe} />
          ))}
        </div>

        {filteredData.length === 0 && (
          <div className="text-white text-center p-4">
            No recipes found. Try another search.
          </div>
        )}
      </div>
    </div>
  );
}
