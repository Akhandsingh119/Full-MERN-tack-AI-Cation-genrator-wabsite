const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

async function generateCaption(base64ImageFile) {
  const contents = [
    {
      inlineData: {
        mimeType: "image/jpeg",
        data: base64ImageFile,
      },
    },
    { text: "Analyze this image and return a JSON object." },
  ];

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: contents,
    config: {
      systemInstruction: `
You are an AI caption generator. Analyze the image and return ONLY valid JSON with no markdown, no code fences, no extra text.

{
  "variants": {
    "short": "A one-line caption under 15 words.",
    "medium": "A 2-3 sentence descriptive caption.",
    "long": "A rich paragraph-length caption with vivid detail."
  },
  "hashtags": ["#relevant1", "#relevant2", "#relevant3", "#relevant4", "#relevant5", "#relevant6", "#relevant7", "#relevant8"]
}

Rules:
- short: brief, punchy, under 15 words
- medium: 2-3 sentences describing the scene
- long: 4-6 sentences, evocative, story-like
- hashtags: exactly 8 relevant, popular hashtags
- Return ONLY the JSON object. No other text.
      `
    }
  });

  const text = response.text;
  try {
    // Strip any markdown code fences if present
    const cleaned = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    // Fallback: wrap as object
    return {
      variants: { short: text, medium: text, long: text },
      hashtags: []
    };
  }
}

module.exports = generateCaption;


