require("dotenv").config();
const OpenAI = require("openai");
const { zodTextFormat } = require("openai/helpers/zod");
const { z } = require("zod");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function promptFoodInformation(req, res) {
  try {
    const ResearchPaperExtraction = z.object({
      title: z.string(),
      authors: z.array(z.string()),
      abstract: z.string(),
      keywords: z.array(z.string()),
    });

    const response = await openai.responses.parse({
      model: "gpt-4o-mini",
      input: [
        {
          role: "system",
          content:
            "You are an expert at structured data extraction. You will be given unstructured text from a research paper and should convert it into the given structure.",
        },
        { role: "user", content: "..." },
      ],
      text: {
        format: zodTextFormat(
          ResearchPaperExtraction,
          "research_paper_extraction"
        ),
      },
    });

    const research_paper = response.output_parsed;
    // const response = await openai.responses.create({
    //   model: "gpt-4o-mini",
    //   input: "Write a one-sentence bedtime story about a unicorn.",
    // });
    return res.status(200).json({ research_paper });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error });
  }
}

module.exports = {
  promptFoodInformation,
};
