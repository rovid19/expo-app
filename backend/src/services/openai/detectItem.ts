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
              You are a reseller pricing assistant.
              
              Read carefully and follow **all** rules:
              
            RULES:
1. Look at the image.
2. Identify the main item (brand, model, year/version if possible).
3. Classify the item into ONE category from: "clothes", "shoes", "car", "other".
4. Estimate a realistic resale price range in ${userCurrency}.
5. Output one JSON object only.
6. No commentary, no markdown, no backticks, no extra text.

The JSON MUST follow this exact structure and key order:

{
  "detected_item": "string",
  "category": "clothes" | "shoes" | "car" | "other",
  "details": "string",
  "resale_price_min": number,
  "resale_price_max": number,
  "confidence": number
}
              
              Where "confidence" is a float between 0 and 1.
              
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
