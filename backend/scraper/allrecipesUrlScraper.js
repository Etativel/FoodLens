// // allrecipesScraper.js
// // Migrated to Apify SDK v3 + Crawlee with dynamic list extraction
// import { Actor } from "apify";
// import { CheerioCrawler } from "crawlee";
// import _ from "underscore";
// import safeEval from "safe-eval";

// function delay(time) {
//   return new Promise((resolve) => setTimeout(resolve, time));
// }

// await Actor.main(async () => {
//   const input = await Actor.getInput();
//   console.log("Input:", input);

//   if (
//     !input ||
//     !Array.isArray(input.startUrls) ||
//     input.startUrls.length === 0
//   ) {
//     throw new Error(
//       "Invalid input: must contain at least one url in 'startUrls'."
//     );
//   }

//   let extendOutputFunction;
//   if (
//     typeof input.extendOutputFunction === "string" &&
//     input.extendOutputFunction.trim()
//   ) {
//     try {
//       extendOutputFunction = safeEval(input.extendOutputFunction);
//     } catch (e) {
//       throw new Error(`Invalid extendOutputFunction: ${e}`);
//     }
//     if (typeof extendOutputFunction !== "function") {
//       throw new Error("extendOutputFunction must be a function.");
//     }
//   }

//   const dataset = await Actor.openDataset();
//   const { itemCount } = await dataset.getInfo();
//   let pagesOutputted = itemCount;
//   const requestQueue = await Actor.openRequestQueue();

//   for (const { url } of input.startUrls) {
//     const label = url.includes("/recipe/") ? "item" : "list";
//     await requestQueue.addRequest({ url, userData: { label } });
//   }

//   const crawler = new CheerioCrawler({
//     requestQueue,
//     maxConcurrency: 5,
//     requestHandlerTimeoutSecs: 240,
//     navigationTimeoutSecs: 120,

//     async requestHandler({ request, $, autoscaledPool }) {
//       await delay(1000);

//       if (request.userData.label === "list") {
//         // Extract all recipe links from the page (href containing '/recipe/')
//         $('a[href*="/recipe/"]').each((i, el) => {
//           const href = $(el).attr("href");
//           if (href && href.startsWith("https://www.allrecipes.com/recipe/")) {
//             requestQueue.addRequest({
//               url: href.split("?")[0],
//               userData: { label: "item" },
//             });
//           }
//         });

//         // Optionally follow pagination if present
//         const next = $('a[rel="next"]').attr("href");
//         if (next)
//           await requestQueue.addRequest({
//             url: next,
//             userData: { label: "list" },
//           });
//       } else {
//         // Scrape recipe detail page
//         const ingredients = $("[itemprop=recipeIngredient]")
//           .map((i, el) => $(el).text().trim())
//           .get();
//         const directions = $(".recipe-directions__list--item")
//           .map((i, el) => $(el).text().trim())
//           .get()
//           .filter((text) => text)
//           .map((text, i) => `${i + 1}. ${text}`);

//         const thumbnail =
//           $('meta[property="og:image"]').attr("content") ||
//           $("img.rec-photo").attr("src");

//         const result = {
//           url: request.url,
//           name:
//             $("h1.headline").text().trim() ||
//             $("#recipe-main-content").text().trim(),
//           rating: $("meta[itemprop=ratingValue]").attr("content"),
//           ratingCount: $("meta[itemprop=reviewCount]").attr("content"),
//           ingredients: ingredients.join(", "),
//           directions: directions.join(" "),
//           prepTime: $("[itemprop=prepTime]").text().trim(),
//           cookTime: $("[itemprop=cookTime]").text().trim(),
//           totalTime: $("[itemprop=totalTime]").text().trim(),
//           calories: $("[itemprop=calories]").text().split(" ")[0],
//           thumbnail,
//           "#debug": Actor.createRequestDebugInfo(request),
//         };

//         if (extendOutputFunction) {
//           const extra = await extendOutputFunction($);
//           _.extend(result, extra);
//         }

//         await Actor.pushData(result);
//         pagesOutputted++;
//         if (input.maxItems && pagesOutputted >= input.maxItems) {
//           console.log(`Reached maxItems (${input.maxItems}). Aborting.`);
//           autoscaledPool.abort();
//         }
//       }
//     },

//     async failedRequestHandler({ request }) {
//       await Actor.pushData({
//         "#isFailed": true,
//         "#debug": Actor.createRequestDebugInfo(request),
//       });
//     },

//     ...input.proxyConfiguration,
//   });

//   await crawler.run();
// });

// allrecipesUrlScraper.js
// Step 1: Scrape all recipe URLs from provided seed pages, without following into detail pages
// allrecipesUrlScraper.js
// Step 1: Scrape all recipe URLs from provided seed pages, without following into detail pages

// allrecipesUrlScraper.js
// allrecipesUrlScraper.js
import { Actor } from "apify";
import { PuppeteerCrawler } from "crawlee";

await Actor.main(async () => {
  const input = await Actor.getInput();
  console.log("Input:", input);

  if (
    !input ||
    !Array.isArray(input.startUrls) ||
    input.startUrls.length === 0
  ) {
    throw new Error(
      "Invalid input: must contain at least one url in 'startUrls'."
    );
  }

  const requestQueue = await Actor.openRequestQueue();
  const allRecipeUrls = new Set(); // Use Set to avoid duplicates

  for (const { url } of input.startUrls) {
    await requestQueue.addRequest({ url });
  }

  const crawler = new PuppeteerCrawler({
    requestQueue,
    maxConcurrency: 2,
    headless: true,
    requestHandlerTimeoutSecs: 90,

    async requestHandler({ request, page }) {
      console.log(`Processing: ${request.url}`);
      await page.waitForSelector('a.mntl-card-list-items[href*="/recipe/"]', {
        timeout: 10000,
      });

      const links = await page.$$eval(
        'a.mntl-card-list-items[href*="/recipe/"]',
        (elements) => Array.from(elements, (el) => el.href.split("?")[0])
      );

      console.log(`Found ${links.length} recipe links on ${request.url}`);

      links.forEach((link) => allRecipeUrls.add(link));
    },

    async failedRequestHandler({ request }) {
      console.error(`Failed to process ${request.url}`);
    },
  });

  await crawler.run();

  // Save all links in one JSON object
  const dataset = await Actor.openDataset();
  await dataset.pushData({ recipeUrls: Array.from(allRecipeUrls) });

  console.log(
    `✅ Scraping complete. Collected ${allRecipeUrls.size} unique URLs.`
  );
});
