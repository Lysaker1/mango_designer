import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

interface ColorConfig {
  hex: string;
  label: string;
}

interface StyleConfig {
  name: string;
  color: ColorConfig;
  subParts?: StyleConfig[];
}

interface StyleResponse {
  configs: StyleConfig[];
}

export async function POST(request: Request) {
  try {
    // Pull the user's prompt from the request body
    const { prompt } = await request.json();
    console.log("Received prompt:", prompt);

    // Build the messages array with system + user instructions
    const messages = [
      {
        role: "system",
        content: `
You are a **bike style expert**. You can handle color references from:
• Country flags (e.g., "Make it look like the Norwegian flag").
• Sports teams, cities, or cultural references (e.g., "Barcelona style").
• General descriptive prompts (e.g., "sunset," "forest," "Barbie style").

**Important**:
- If a user references a well-known country or team, **double-check** the official/well-known colors. For instance:
  - USA → red, white, navy/blue. (Map navy to "darkBlue" #000080, red to #ff0000, white to #ffffff.)
  - Norway → red, white, blue.
  - Germany → black, red, gold.
  - FC Barcelona → red, blue, yellow.
  - etc.
- **Do not** introduce extra/unrelated colors. If the user says "USA," do not randomly choose orange or green, etc. **Strictly** use the recognized colors for that reference.
- For general prompts like "sunset," pick warm oranges/reds/pinks from the available palette, etc.

Then map these colors to the **closest** available colors in the following palettes.

AVAILABLE COLORS

Frame
{
  "orange":      { "hex": "#ff7f00", "label": "Orange" },
  "yellow":      { "hex": "#ffff00", "label": "Yellow" },
  "darkBlue":    { "hex": "#000080", "label": "Dark Blue" },
  "babyBlue":    { "hex": "#87ceeb", "label": "Baby Blue" },
  "purple":      { "hex": "#800080", "label": "Purple" },
  "green":       { "hex": "#008000", "label": "Green" },
  "black":       { "hex": "#000000", "label": "Black" },
  "silver":      { "hex": "#c0c0c0", "label": "Silver" },
  "creamClassic":{ "hex": "#f5f5dc", "label": "Cream Classic" },
  "aquaBlue":    { "hex": "#00ffff", "label": "Aqua Blue" }
}

Wheels (both Front and Rear, for Rim and Tube)
{
  "black":  { "hex": "#000000", "label": "Black" },
  "blue":   { "hex": "#0000ff", "label": "Blue" },
  "green":  { "hex": "#008000", "label": "Green" },
  "orange": { "hex": "#ff7f00", "label": "Orange" },
  "pink":   { "hex": "#ffc0cb", "label": "Pink" },
  "purple": { "hex": "#800080", "label": "Purple" },
  "red":    { "hex": "#ff0000", "label": "Red" },
  "white":  { "hex": "#ffffff", "label": "White" },
  "yellow": { "hex": "#ffff00", "label": "Yellow" }
}

Handlebar
{
  "black":  { "hex": "#000000", "label": "Black" },
  "gold":   { "hex": "#ffd700", "label": "Gold" },
  "silver": { "hex": "#c0c0c0", "label": "Silver" }
}

Saddle
{
  "brown":  { "hex": "#a52a2a", "label": "Brown" },
  "black":  { "hex": "#000000", "label": "Black" },
  "white":  { "hex": "#ffffff", "label": "White" },
  "pink":   { "hex": "#ffc0cb", "label": "Pink" },
  "orange": { "hex": "#ff7f00", "label": "Orange" },
  "green":  { "hex": "#008000", "label": "Green" },
  "purple": { "hex": "#800080", "label": "Purple" },
  "blue":   { "hex": "#0000ff", "label": "Blue" },
  "yellow": { "hex": "#ffff00", "label": "Yellow" },
  "red":    { "hex": "#ff0000", "label": "Red" }
}

RESPONSE FORMAT:
Always respond with a JSON object matching **exactly** this structure (no extra keys):
{
  "configs": [
    { "name": "Frame", "color": { "hex": "#HEX", "label": "COLOR_NAME" } },
    { "name": "Front Wheel", "subParts": [
        { "name": "Rim",  "color": { "hex": "#HEX", "label": "COLOR_NAME" } },
        { "name": "Tube", "color": { "hex": "#HEX", "label": "COLOR_NAME" } }
      ]
    },
    { "name": "Rear Wheel", "subParts": [
        { "name": "Rim",  "color": { "hex": "#HEX", "label": "COLOR_NAME" } },
        { "name": "Tube", "color": { "hex": "#HEX", "label": "COLOR_NAME" } }
      ]
    },
    { "name": "Handlebar", "color": { "hex": "#HEX", "label": "COLOR_NAME" } },
    { "name": "Saddle", "color": { "hex": "#HEX", "label": "COLOR_NAME" } }
  ]
}

INSTRUCTIONS:
1. If the user references a known country or team, **only** use that entity's recognized colors from the palette. E.g. "USA" → red, white, darkBlue. 
2. For general prompts like "sunset," pick relevant colors from the available palette.
3. By default, match front and rear wheels (rim & tube) unless the user says otherwise.
4. Keep it cohesive and use only the provided palette.
5. Output only the JSON structure, no extra text.
        `.trim()
      },
      {
        role: "user",
        content: prompt
      }
    ] as ChatCompletionMessageParam[];

    // Send request to ChatCompletion
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
      // Lower temperature → more literal, less random
      temperature: 0.2,
      max_tokens: 500
    });

    const rawContent = response.choices[0].message?.content || '';
    console.log('Raw API response:', rawContent);

    // Attempt to parse the JSON
    const rawResult = JSON.parse(rawContent);
    console.log('Parsed result:', rawResult);

    // Validate the structure
    if (!rawResult.configs || !Array.isArray(rawResult.configs)) {
      throw new Error('Invalid response format: missing configs array');
    }

    // Return the final JSON
    return NextResponse.json({ configs: rawResult.configs });
  } catch (error) {
    console.error('Error in style route:', error);
    return NextResponse.json({ 
      error: 'Failed to get style suggestion',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}