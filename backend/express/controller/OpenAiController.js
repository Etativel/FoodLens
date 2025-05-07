require("dotenv").config();
const OpenAI = require("openai");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { zodTextFormat } = require("openai/helpers/zod");
const { z } = require("zod");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const DefaultStructure = z.object({
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

const VisionStructure = z.object({
  name: z.string(),
  predicted_label: z.string().transform((value) => {
    return value
      .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
      .replace(/\s+/g, "_")
      .toLowerCase();
  }),
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

// const VisionResult = z.object({
//   predictedName: z
//     .string()
//     .transform((s) =>
//       s.replace(/([a-z0-9])([A-Z])/g, "$1$2").replace(/\s+/g, "")
//     ),
//   representingName: z.string(),
// });

// 2) “detectDish” middleware
// async function detectDish(req, res, next) {
//   try {
//     const vision = await openai.responses.parse({
//       model: "gpt-4.1-mini",
//       input: [
//         {
//           role: "system",
//           content: `

// You are a culinary image-recognition assistant. Analyze the provided image in detail and determine the most accurate name of the dish shown.

// - The predicted name should be in snake case and lower case (e.g., nasi_pecel)

// - The representingName should describe most accurate view of the image (e.g, Nasi pecel with tempe and egg)
//           `.trim(),
//         },
//         {
//           role: "user",
//           content: [{ type: "input_image", image_url: req.file.path }],
//         },
//       ],
//       text: {
//         format: zodTextFormat(VisionResult, "vision"),
//       },
//     });

//     const { predictedName, representingName } = vision.output_parsed;
//     req.predictedName = predictedName;
//     req.representingName = representingName;

//     console.log("This is the vision result, ", vision.output_parsed);

//     // Lookup in your database
//     const existing = await prisma.recipe.findUnique({
//       where: {
//         predicted_name: predictedName,
//       },
//     });

//     if (existing) {
//       return res.json({ recipe: existing, fromCache: true });
//     }

//     return next();
//   } catch (err) {
//     console.error("Vision step failed:", err);
//     return res.status(500).json({ error: err.message });
//   }
// }

// async function continueVision(req, res) {
//   try {
//     // use the human‐readable name as input
//     const input = req.representingName;

//     const Recipe = z.object({
//       summary: z.string(),
//       nutritionSnapshot: z.object({
//         calories: z.number(),
//         protein: z.number(),
//         fat: z.number(),
//         carbs: z.number(),
//         fiber: z.number(),
//         sugar: z.number(),
//         sodium: z.number(),
//       }),
//       nutritionItems: z.array(
//         z.object({
//           name: z.string(),
//           value: z.number(),
//           unit: z.string(),
//         })
//       ),
//       badgeKeys: z.array(z.string()),
//       ingredients: z.array(
//         z.object({
//           group: z.string(),
//           items: z.array(z.string()),
//         })
//       ),
//       instructions: z.array(
//         z.object({
//           step: z.number(),
//           description: z.string(),
//           duration: z.string().optional(),
//         })
//       ),
//       tips: z.array(z.string()),
//       variations: z.array(
//         z.object({
//           name: z.string(),
//           add: z.string().optional(),
//           swap: z.string().optional(),
//         })
//       ),
//       culturalContext: z.string(),
//       funFacts: z.array(z.string()),
//     });

//     const response = await openai.responses.parse({
//       model: "gpt-4o-2024-08-06",
//       input: [
//         {
//           role: "system",
//           content: `
// You are a culinary assistant. When given a recipe name or short description, you must:
// - Write a concise, one-sentence summary of the dish (e.g., "A quick, healthy cod dish crusted in sesame and served with crisp sugar snap peas.").
// - Look up or estimate a realistic nutrition snapshot (calories, macros, sodium).
// - Break out each nutrition metric into a name/value/unit list.
// - Tag the recipe with appropriate badgeKeys (e.g., Vegetarian, Baked).
// - Group ingredients into logical sections (e.g., Crust, Filling).
// - Produce step-by-step instructions, each with an optional duration.
// - Offer 3–5 chef’s tips.
// - Suggest 2–3 tasty variations (with “add” or “swap” text).
// - Provide a concise culturalContext blurb.
// - List 2–4 funFacts about this dish.

// Make sure the output exactly matches the “recipe” Zod schema.
//           `.trim(),
//         },
//         {
//           role: "user",
//           content: input,
//         },
//       ],
//       text: {
//         format: zodTextFormat(Recipe, "recipe"),
//       },
//     });

//     const recipe = response.output_parsed;

//     console.log("this is the continue vision, ", recipe);

//     // OPTIONAL: persist the newly generated recipe
//     await prisma.recipe.create({
//       ...recipe,
//       name: req.representingName,
//       predicted_name: req.predictedName,
//     });

//     return res.json({ recipe, fromCache: false });
//   } catch (error) {
//     console.error("Recipe generation failed:", error);
//     return res.status(500).json({ message: error.message });
//   }
// }

async function promptFoodInformation(req, res) {
  const { input } = req.body;
  try {
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
        format: zodTextFormat(DefaultStructure, "recipe"),
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

// async function openaiVision(req, res) {
//   const imageUrl = req.file.path;
//   const Recipe = z.object({
//     name: z.string(),
//     predicted_label: z.string().transform((value) => {
//       return value
//         .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
//         .replace(/\s+/g, "_")
//         .toLowerCase();
//     }),
//     summary: z.string(),
//     nutritionSnapshot: z.object({
//       calories: z.number(),
//       protein: z.number(),
//       fat: z.number(),
//       carbs: z.number(),
//       fiber: z.number(),
//       sugar: z.number(),
//       sodium: z.number(),
//     }),
//     nutritionItems: z.array(
//       z.object({
//         name: z.string(),
//         value: z.number(),
//         unit: z.string(),
//       })
//     ),
//     badgeKeys: z.array(z.string()),

//     ingredients: z.array(
//       z.object({
//         group: z.string(),
//         items: z.array(z.string()),
//       })
//     ),
//     instructions: z.array(
//       z.object({
//         step: z.number(),
//         description: z.string(),
//         duration: z.string().optional(),
//       })
//     ),
//     tips: z.array(z.string()),
//     variations: z.array(
//       z.object({
//         name: z.string(),
//         add: z.string().optional(),
//         swap: z.string().optional(),
//       })
//     ),
//     culturalContext: z.string(),
//     funFacts: z.array(z.string()),
//   });

//   try {
//     const visionResponse = await openai.responses.parse({
//       model: "gpt-4.1-mini",
//       input: [
//         {
//           role: "system",
//           content: `
//    You are a culinary image recognition assistant. Analyze the provided image in detail and determine the most accurate name of the dish shown
//               `.trim(),
//         },
//         {
//           role: "user",
//           content: [
//             {
//               type: "input_image",
//               image_url: imageUrl,
//             },
//           ],
//         },
//       ],
//     });

//     console.log("This is the vision result", visionResponse);

//     const dishName = visionResponse.output_text.trim();

//     console.log(dishName);

//     const structuredResponse = await openai.responses.parse({
//       model: "gpt-4o-2024-08-06",
//       input: [
//         {
//           role: "system",
//           content: `
// You are a culinary assistant. When given a recipe name or short description, you must:
// - Write a concise, one-sentence summary of the dish (e.g., "A quick, healthy cod dish crusted in sesame and served with crisp sugar snap peas.").
// - The predicted_label should be the actual name of the dishes without any added information, it should be on lowercase and snake case for example ice_scream
// - Look up or estimate a realistic nutrition snapshot (calories, macros, sodium).
// - Break out each nutrition metric into a name/value/unit list.
// - Tag the recipe with appropriate badgeKeys (e.g., Vegetarian, Baked).
// - Group ingredients into logical sections (e.g., Crust, Filling).
// - Produce step-by-step instructions, each with an optional duration.
// - Offer 3–5 chef’s tips.
// - Suggest 2–3 tasty variations (with “add” or “swap” text).
// - Provide a concise culturalContext blurb.
// - List 2–4 funFacts about this dish.

// Make sure the output exactly matches the “recipe” Zod schema.
//           `.trim(),
//         },
//         {
//           role: "user",
//           content: dishName,
//         },
//       ],
//       text: {
//         format: zodTextFormat(Recipe, "recipe"),
//       },
//     });

//     const recipe = structuredResponse.output_parsed;
//     console.log(recipe);

//     return res.status(200).json({ recipe, imageUrl });
//   } catch (error) {
//     console.error("Error analyzing image:", error);

//     return res.status(500).json({ message: error.message });
//   }
// }

// new one

async function openaiVision(req, res) {
  const imageUrl = req.file.path;

  try {
    const structuredResponse = await openai.responses.parse({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content: `
You are a culinary image-recognition assistant. Analyze the provided image in detail and determine the most accurate name of the dish shown.
  `.trim(),
        },
        {
          role: "system",
          content: `
        You are a culinary assistant. When given a recipe name or short description, you must:
        - Write a concise, one-sentence summary of the dish (e.g., "A quick, healthy cod dish crusted in sesame and served with crisp sugar snap peas.").
        - Name should be normal capitalization, either Title Case (e.g. “Ice Cream”) or capitalize only the first word (e.g. “Ice cream”). No snake_case.
        - The predicted_label should be the actual name of the dishes without any added information, it should be on lowercase and snake case for example ice_scream
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
          content: [
            {
              type: "input_image",
              image_url: imageUrl,
            },
          ],
        },
      ],
      text: {
        format: zodTextFormat(VisionStructure, "recipe"),
      },
    });

    const recipe = structuredResponse.output_parsed;
    return res.status(200).json({ recipe, imageUrl });
  } catch (error) {
    console.error("Error analyzing image:", error);
    return res.status(500).json({ message: error.message });
  }
}

module.exports = {
  promptFoodInformation,
  openaiVision,
  // detectDish,
  // continueVision,
};
