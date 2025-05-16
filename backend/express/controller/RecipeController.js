// GET

async function getRecipe(req, res) {
  const query = req.query.search;
  try {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
    );
    const recipe = await response.json();

    return res.status(200).json({ recipe });
  } catch (err) {
    console.log("internal server error, ", err);
    return res.status(500).json({ message: err });
  }
}

async function getSingleRecipe(req, res) {
  const recipeId = req.query.search;

  try {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeId}`
    );

    const recipe = await response.json();

    return res.status(200).json({ recipe });
  } catch (err) {
    console.log("Internal server error, ", err);
    return res.status(500).json({ message: err });
  }
}

module.exports = {
  getRecipe,
  getSingleRecipe,
};
