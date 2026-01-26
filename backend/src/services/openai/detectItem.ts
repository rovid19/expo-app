import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

export class ScanItem {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_KEY!,
    });
  }

  async detectItem(image: File, userCurrency: string) {
    const upload = await this.openai.files.create({
      file: image as any,
      purpose: "vision",
    });

    const response = await this.openai.responses.create({
      model: "gpt-4o-mini",
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: `
You are a reseller product identification assistant.

Follow ALL rules exactly.

RULES:
1. Analyze the image carefully.
2. Identify the main item shown (brand, model, variant, year if visible).
3. If the exact product cannot be identified, infer the closest generic product type.
4. Classify the item into ONE category from:
   "clothes", "shoes", "cars", "electronics", "furniture", "other".
5. Estimate a single realistic resale value in ${userCurrency}.
6. Write a high-quality product description based only on what is visible:
   - apparent condition (new / like new / used / worn / damaged)
   - visible wear, defects, or missing parts
   - material, color, form factor if applicable
7. Generate an eBay search query a human would realistically use to find this item.
   - If brand/model is known: include them.
   - If unknown: use generic but specific descriptors (type, material, style, use-case).
8. Output ONE valid JSON object only.
9. No explanations, no markdown, no extra text.

The JSON MUST follow this exact structure and key order:

{
  "detected_item": "string",
  "category": "clothes" | "shoes" | "cars" | "electronics" | "furniture" | "other",
  "details": "string",
  "estimated_resale_price": number,
  "ebay_search_query": "string",
  "confidence": number
}

Where:
- "estimated_resale_price" is a single numeric estimate.
- "confidence" is a float between 0 and 1 representing identification certainty.

Output ONLY the JSON object.
`.trim(),
            },
            {
              type: "input_image",
              file_id: upload.id,
              detail: "auto",
            },
          ],
        },
      ],
    });

    const jsonText = response.output_text;
    const parsed = JSON.parse(jsonText);

    return parsed;
  }
}
