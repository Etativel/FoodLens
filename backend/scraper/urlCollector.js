import { Actor } from "apify";
import { PuppeteerCrawler } from "crawlee";
import fs from "fs";
import path from "path";

await Actor.main(async () => {
  const input = (await Actor.getInput()) || {};
  console.log("Input:", input);

  const startUrls = input.startUrls || [{ url: "https://www.allrecipes.com/" }];
  const maxItems = input.maxItems || 10;

  const requestQueue = await Actor.openRequestQueue();
  const allRecipeUrls = new Set();

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
        await page
          .waitForSelector('a.mntl-card-list-items[href*="/recipe/"]', {
            timeout: 10000,
          })
          .catch(() =>
            console.log("Warning: Timeout waiting for recipe links")
          );

        const links = await page.$$eval(
          'a.mntl-card-list-items[href*="/recipe/"], a[href*="/recipe/"]',
          (elements) => Array.from(elements, (el) => el.href.split("?")[0])
        );

        console.log(`Found ${links.length} recipe links on ${request.url}`);

        links.forEach((link) => {
          if (link.includes("/recipe/")) {
            allRecipeUrls.add(link);
          }
        });

        if (allRecipeUrls.size < maxItems) {
          const categoryLinks = await page.$$eval(
            'a[href*="/recipes/"], a[href*="/gallery/"], a.link-list__link',
            (elements) => Array.from(elements, (el) => el.href)
          );

          for (const link of categoryLinks.slice(0, 5)) {
            if (await requestQueue.addRequest({ url: link })) {
              console.log(`Added category to queue: ${link}`);
            }
          }
        }
      } catch (error) {
        console.error(`Error processing ${request.url}:`, error);
      }

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

  const datasetDir = "./storage/datasets/default";
  if (!fs.existsSync(datasetDir)) {
    fs.mkdirSync(datasetDir, { recursive: true });
  }

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
