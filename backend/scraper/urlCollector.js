import { Actor } from "apify";
import { PuppeteerCrawler } from "crawlee";
import fs from "fs";
import path from "path";

await Actor.main(async () => {
  const input = (await Actor.getInput()) || {};
  console.log("Input:", input);

  // default values
  const startUrls = input.startUrls || [{ url: "https://www.allrecipes.com/" }];
  const maxItems = input.maxItems || 10;

  const requestQueue = await Actor.openRequestQueue();
  const allRecipeUrls = new Set(); //avoid duplicates

  for (const { url } of startUrls) {
    await requestQueue.addRequest({ url });
  }

  const crawler = new PuppeteerCrawler({
    requestQueue,
    maxConcurrency: 2,
    headless: true,
    requestHandlerTimeoutSecs: 90,

    async requestHandler({ request, page }) {
      console.log(`Processing: ${request.url}`);

      try {
        // Wait links to load
        await page
          .waitForSelector('a.mntl-card-list-items[href*="/recipe/"]', {
            timeout: 10000,
          })
          .catch(() =>
            console.log("Warning: Timeout waiting for recipe links")
          );

        // Extract recipe links
        const links = await page.$$eval(
          'a.mntl-card-list-items[href*="/recipe/"], a[href*="/recipe/"]',
          (elements) => Array.from(elements, (el) => el.href.split("?")[0])
        );

        console.log(`Found ${links.length} recipe links on ${request.url}`);

        // Add links to our collection
        links.forEach((link) => {
          if (link.includes("/recipe/")) {
            allRecipeUrls.add(link);
          }
        });

        // If we don't have enough links yet, try to find more pages to crawl
        if (allRecipeUrls.size < maxItems) {
          // Look for category or collection links to add to the queue
          const categoryLinks = await page.$$eval(
            'a[href*="/recipes/"], a[href*="/gallery/"], a.link-list__link',
            (elements) => Array.from(elements, (el) => el.href)
          );

          // Add up to 5 category links to the queue
          for (const link of categoryLinks.slice(0, 5)) {
            if (await requestQueue.addRequest({ url: link })) {
              console.log(`Added category to queue: ${link}`);
            }
          }
        }
      } catch (error) {
        console.error(`Error processing ${request.url}:`, error);
      }

      // If it reached the max items, stop the crawler
      if (allRecipeUrls.size >= maxItems) {
        console.log(`Reached max items (${maxItems}), stopping the crawler.`);
        await crawler.autoscaledPool.abort();
      }
    },

    async failedRequestHandler({ request }) {
      console.error(`Failed to process ${request.url}`);
    },
  });

  await crawler.run();

  // Ensure the output directories exist
  const datasetDir = "./storage/datasets/default";
  if (!fs.existsSync(datasetDir)) {
    fs.mkdirSync(datasetDir, { recursive: true });
  }

  // Save all links in one JSON object
  const outputPath = path.join(datasetDir, "000000001.json");
  const recipeUrlsArray = Array.from(allRecipeUrls).slice(0, maxItems);

  fs.writeFileSync(
    outputPath,
    JSON.stringify({ recipeUrls: recipeUrlsArray }, null, 2)
  );

  console.log(
    `URL Collection complete. Collected ${recipeUrlsArray.length} unique recipe URLs.`
  );
  console.log(`Output saved to: ${outputPath}`);
});
