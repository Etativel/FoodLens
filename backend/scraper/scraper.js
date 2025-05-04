import { Actor } from "apify";
import { PuppeteerCrawler } from "crawlee";
import { load } from "cheerio";
import fs from "fs";
import path from "path";

await Actor.main(async () => {
  const input = await Actor.getInput();
  console.log("Input:", input);

  // Set default max items if not provided
  const maxItems = input?.maxItems || 50;

  let recipeUrls = [
    "https://www.allrecipes.com/recipe/265406/carrot-noodles/",
    "https://www.allrecipes.com/recipe/275430/air-fried-sesame-crusted-cod-with-snap-peas/",
    "https://www.allrecipes.com/recipe/229065/purple-cabbage-salad/",
    "https://www.allrecipes.com/recipe/19960/avocado-salad/",
    "https://www.allrecipes.com/recipe/257600/cauliflower-rice-and-beans-fajita-bowls/",
    "https://www.allrecipes.com/recipe/281589/warm-caprese-zoodles/",
    "https://www.allrecipes.com/recipe/221907/pastel-de-tres-leches-three-milk-cake/",
    "https://www.allrecipes.com/recipe/261055/sweet-bread-strata/",
    "https://www.allrecipes.com/recipe/281780/spicy-meatless-spaghetti-sauce/",
  ];

  // Try to load the recipe URLs from previous crawl result
  try {
    const datasetPath = "./storage/datasets/default/000000001.json";
    if (fs.existsSync(datasetPath)) {
      console.log("Found previous crawl result. Loading recipe URLs...");
      const rawData = fs.readFileSync(datasetPath, "utf8");
      const data = JSON.parse(rawData);

      if (data && Array.isArray(data.recipeUrls)) {
        recipeUrls = data.recipeUrls.slice(0, maxItems);
        console.log(
          `Loaded ${recipeUrls.length} recipe URLs from previous crawl.`
        );
      }
    }
  } catch (error) {
    console.error("Error loading recipe URLs from previous crawl:", error);
  }

  // If no URLs were loaded, check if they were provided in the input
  if (
    recipeUrls.length === 0 &&
    input?.recipeUrls &&
    Array.isArray(input.recipeUrls)
  ) {
    recipeUrls = input.recipeUrls.slice(0, maxItems);
    console.log(`Using ${recipeUrls.length} recipe URLs from input.`);
  }

  if (recipeUrls.length === 0) {
    throw new Error(
      "No recipe URLs found! Please run the URL collector first or provide URLs in the input."
    );
  }

  const requestQueue = await Actor.openRequestQueue();
  const recipes = [];

  for (const url of recipeUrls) {
    await requestQueue.addRequest({ url });
  }

  const crawler = new PuppeteerCrawler({
    requestQueue,
    maxConcurrency: 2,
    headless: true,
    requestHandlerTimeoutSecs: 90,

    async requestHandler({ request, page }) {
      console.log(`Processing: ${request.url}`);

      // Wait for the main content to be loaded
      await page.waitForSelector("h1.article-heading", {
        timeout: 10000,
      });

      // Get the page HTML
      const content = await page.content();
      const $ = load(content);

      // Extract recipe information
      const recipe = {
        url: request.url,
        name: $("h1.article-heading").text().trim(),
        thumbnail: extractThumbnail($),
        rating: $(".mm-recipes-review-bar__rating").text().trim() || null,
        ratingCount: extractRatingCount($),
        ingredients: extractIngredients($),
        prepTime: extractTime($, "Prep Time:"),
        cookTime: extractTime($, "Cook Time:"),
        totalTime: extractTime($, "Total Time:"),
        servings: extractServings($),
        yield: extractYield($),
        directions: extractDirections($),
        nutrition: extractNutrition($),
      };

      recipes.push(recipe);
      console.log(`Successfully scraped recipe: ${recipe.name}`);
    },

    async failedRequestHandler({ request }) {
      console.error(`Failed to process ${request.url}`);
    },
  });

  await crawler.run();

  // Save all recipe data
  const dataset = await Actor.openDataset();
  await dataset.pushData(recipes);

  console.log(`Scraping complete. Collected ${recipes.length} recipes.`);
});

function extractThumbnail($) {
  // Try to get the main image
  const imageEl = $(".primary-image__image");

  if (imageEl.length > 0) {
    // Try to get the src attribute
    const src = imageEl.attr("src");
    if (src) return src;

    // If no src, try to get from srcset
    const srcset = imageEl.attr("srcset");
    if (srcset) {
      // Extract the first URL from srcset
      const matches = srcset.match(/([^\s]+)/);
      if (matches && matches[1]) return matches[1];
    }
  }

  return null;
}

function extractRatingCount($) {
  const text = $(".mm-recipes-review-bar__rating-count").text().trim();
  // Extract number from format like "(2)"
  const matches = text.match(/\((\d+)\)/);
  return matches ? parseInt(matches[1]) : 0;
}

function extractIngredients($) {
  const ingredients = [];

  $(".mm-recipes-structured-ingredients__list-item").each((i, el) => {
    const quantity = $(el).find("[data-ingredient-quantity]").text().trim();
    const unit = $(el).find("[data-ingredient-unit]").text().trim();
    const name = $(el).find("[data-ingredient-name]").text().trim();

    ingredients.push({
      quantity,
      unit,
      name,
    });
  });

  return ingredients;
}

function extractTime($, label) {
  const timeItem = $(`.mm-recipes-details__item:contains("${label}")`);
  if (timeItem.length > 0) {
    return timeItem.find(".mm-recipes-details__value").text().trim();
  }
  return null;
}

function extractServings($) {
  const servingsItem = $('.mm-recipes-details__item:contains("Servings:")');
  if (servingsItem.length > 0) {
    const servingsText = servingsItem
      .find(".mm-recipes-details__value")
      .text()
      .trim();
    // Extract number from text
    const matches = servingsText.match(/(\d+)/);
    return matches ? parseInt(matches[1]) : null;
  }
  return null;
}

function extractYield($) {
  const yieldItem = $('.mm-recipes-details__item:contains("Yield:")');
  if (yieldItem.length > 0) {
    return yieldItem.find(".mm-recipes-details__value").text().trim();
  }
  return null;
}

function extractDirections($) {
  const directions = [];

  $(".mntl-sc-block-group--OL > li").each((i, el) => {
    const stepText = $(el).find("p").text().trim();
    if (stepText) {
      directions.push(stepText);
    }
  });

  return directions;
}

function extractNutrition($) {
  const nutrition = {};

  // Extract basic nutrition facts from summary
  $(".mm-recipes-nutrition-facts-summary__table-row").each((i, el) => {
    const value = $(el)
      .find(".mm-recipes-nutrition-facts-summary__table-cell:first-child")
      .text()
      .trim();
    const label = $(el)
      .find(".mm-recipes-nutrition-facts-summary__table-cell:last-child")
      .text()
      .trim()
      .toLowerCase();

    if (value && label) {
      nutrition[label] = value;
    }
  });

  // Extract detailed nutrition facts
  $(".mm-recipes-nutrition-facts-label__table-body tr").each((i, el) => {
    const cells = $(el).find("td");
    if (cells.length >= 1) {
      let label = $(cells[0])
        .find(".mm-recipes-nutrition-facts-label__nutrient-name")
        .text()
        .trim()
        .toLowerCase();
      let value = $(cells[0]).text().replace(label, "").trim();

      // Clean up the label
      label = label.replace(/\s+/g, "_");
      if (label.endsWith("_")) {
        label = label.slice(0, -1);
      }

      if (label && value) {
        nutrition[label] = value;
      }
    }
  });

  return nutrition;
}
