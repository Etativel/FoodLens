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
