require("dotenv").config();
const OpenAI = require("openai");
const { zodTextFormat } = require("openai/helpers/zod");
const { z } = require("zod");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function promptFoodInformation(req, res) {
  const { input } = req.body;
  try {
    const Recipe = z.object({
      summary: z.string(),
      nutritionSnapshot: z.object({
        calories: z.number(),
        protein: z.number(),
        fat: z.number(),
        carbs: z.number(),
        fiber: z.number(),
        sugar: z.number(),
        sodium: z.number(),
      }),
      nutritionItems: z.array(
        z.object({
          name: z.string(),
          value: z.number(),
          unit: z.string(),
        })
      ),
      badgeKeys: z.array(z.string()),
      ingredients: z.array(
        z.object({
          group: z.string(),
          items: z.array(z.string()),
        })
      ),
      instructions: z.array(
        z.object({
          step: z.number(),
          description: z.string(),
          duration: z.string().optional(),
        })
      ),
      tips: z.array(z.string()),
      variations: z.array(
        z.object({
          name: z.string(),
          add: z.string().optional(),
          swap: z.string().optional(),
        })
      ),
      culturalContext: z.string(),
      funFacts: z.array(z.string()),
    });

    const response = await openai.responses.parse({
      model: "gpt-4o-2024-08-06",
      input: [
        {
          role: "system",
          content: `
You are a culinary assistant. When given a recipe name or short description, you must:
- Write a concise, one-sentence summary of the dish (e.g., "A quick, healthy cod dish crusted in sesame and served with crisp sugar snap peas.").
- Look up or estimate a realistic nutrition snapshot (calories, macros, sodium).
- Break out each nutrition metric into a name/value/unit list.
- Tag the recipe with appropriate badgeKeys (e.g., Vegetarian, Baked).
- Group ingredients into logical sections (e.g., Crust, Filling).
- Produce step-by-step instructions, each with an optional duration.
- Offer 3–5 chef’s tips.
- Suggest 2–3 tasty variations (with “add” or “swap” text).
- Provide a concise culturalContext blurb.
- List 2–4 funFacts about this dish.

Make sure the output exactly matches the “recipe” Zod schema.
          `.trim(),
        },
        {
          role: "user",
          content: input,
        },
      ],
      text: {
        format: zodTextFormat(Recipe, "recipe"),
      },
    });

    const recipe = response.output_parsed;
    console.log(recipe);

    return res.status(200).json({ recipe });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error });
  }
}

module.exports = {
  promptFoodInformation,
};
