import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

export default function RecipeDetails() {
  const { recipeId } = useParams();
  const [recipe, setRecipe] = useState();
  const { state } = useLocation();
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    if (state?.recipe) {
      setRecipe(state.recipe);
      return;
    }
    async function fetchDetails() {
      try {
        setIsFetching(true);

        const response = await fetch(
          `http://localhost:3000/recipe/single?search=${encodeURIComponent(
            recipeId
          )}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!response.ok) {
          console.log("Failed to retrieve details ", response.statusText);
          setIsFetching(false);
          return;
        }

        const data = await response.json();

        setRecipe(data.recipe.meals[0]);
        setIsFetching(false);
      } catch (err) {
        setIsFetching(false);
        console.log("Server error", err);
      }
    }

    fetchDetails();
  }, [recipeId, state]);

  const getIngredients = (recipe) => {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = recipe[`strIngredient${i}`];
      const measure = recipe[`strMeasure${i}`];

      if (ingredient && ingredient.trim() !== "") {
        ingredients.push({ ingredient, measure: measure.trim() });
      }
    }
    return ingredients;
  };

  if (isFetching) {
    return (
      <div className=" h-screen w-full flex justify-center items-center">
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
    <>
      {recipe && (
        <div className="max-w-2xl mx-auto bg-neutral-900 shadow-lg rounded-lg overflow-hidden">
          <div className="relative">
            <div
              className="h-64 w-full bg-cover bg-center"
              style={{
                backgroundImage: `url(${recipe.strMealThumb})`,
              }}
            ></div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent flex items-end">
              <div className="p-6">
                <h1 className="text-3xl font-bold text-white mb-2">
                  {recipe.strMeal}
                </h1>
                <div className="flex space-x-2">
                  <span className="px-2 py-1 bg-orange-500 text-white text-xs font-semibold rounded-full">
                    {recipe.strCategory}
                  </span>
                  <span className="px-2 py-1 bg-blue-500 text-white text-xs font-semibold rounded-full">
                    {recipe.strArea}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Recipe Content */}
          <div className="p-6">
            <div className="md:flex md:space-x-6">
              {/* Ingredients  */}
              <div className="md:w-1/3 mb-6 md:mb-0">
                <h2 className="text-xl font-semibold text-gray-200 mb-4 pb-2 border-b border-gray-700">
                  Ingredients
                </h2>
                <ul className="space-y-2">
                  {getIngredients(recipe).map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-block w-2 h-2 bg-orange-500 rounded-full mt-2 mr-2"></span>
                      <span className="text-gray-300">
                        <span className="font-medium">{item.measure}</span>{" "}
                        {item.ingredient}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Instructions  */}
              <div className="md:w-2/3">
                <h2 className="text-xl font-semibold text-gray-200 mb-4 pb-2 border-b border-gray-700">
                  Instructions
                </h2>
                <div className="text-gray-300 space-y-4">
                  {recipe.strInstructions.split("\r\n").map((step, index) => (
                    <p key={index} className="leading-relaxed">
                      {step}
                    </p>
                  ))}
                </div>

                {/* YouTube  */}
                {recipe.strYoutube && (
                  <div className="mt-6">
                    <a
                      href={recipe.strYoutube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                      </svg>
                      Watch Tutorial
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
