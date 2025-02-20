import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

export interface ColorConfig {
  hex: string;
  label: string;
}

export interface StyleConfig {
  name: string;
  color: ColorConfig;
  subParts?: StyleConfig[];
}

export interface StyleResponse {
  configs: StyleConfig[];
}

export async function POST(request: Request) {
  try {
    // More detailed debug logging
    console.log("Environment variables present:", {
      env: process.env.NODE_ENV,
      hasEnv: !!process.env.OPENAI_API_KEY,
      keyStart: process.env.OPENAI_API_KEY?.substring(0, 10),
      fromDotEnv: process.env.OPENAI_API_KEY === 'sk-proj-mfVr',
      envFiles: {
        hasEnvLocal: process.env.NEXT_RUNTIME === 'edge' ? 'N/A' : require('fs').existsSync('.env.local'),
        hasEnv: process.env.NEXT_RUNTIME === 'edge' ? 'N/A' : require('fs').existsSync('.env')
      }
    });

    if (!process.env.OPENAI_API_KEY) {
      console.error("OpenAI API key is missing");
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    console.log("Starting bike style mapping request with API key type:", 
      process.env.OPENAI_API_KEY.startsWith('sk-') ? 'Standard key' : 'Unknown key type');

    // Get the user's freeform styling prompt.
    const { prompt } = await request.json();
    console.log("Received styling prompt:", prompt);

    // STEP 1: Generate a weighted color theme from the user's prompt.
    console.log("Step 1: Generating weighted color theme...");
    // The system prompt now instructs the model to output a JSON with a "theme" object (with a "colors" array)
    // and a short, minimal "message" that explains the interpretation.
    const themeSystemPrompt = `
You are a bike style theme generator and mapper. Your task is to analyze a user's freeform styling prompt and generate a weighted color theme that will later be mapped to specific bike parts. You must determine the number of colors based on the input: if the input suggests a flag, pattern, or theme with more than two colors (e.g. "USA", "Russia", "rainbow", "multicolor"), output all the relevant colors with appropriate weights. If the input suggests only one or two colors, output exactly one or two colors with dominant and secondary weights. But you should analyze the input and determine if it suggests a single color or multiple colors.

Use the following source of truth for bike parts and their subparts:

**Bike Parts and Subparts:**
- **Frame:** Uses a single color from the Frame Palette.
- **Front Wheel:** Has two subparts:
  - *Rim* (color from the Wheels Palette)
  - *Tube* (color from the Wheels Palette)
- **Rear Wheel:** Has two subparts:
  - *Rim* (color from the Wheels Palette)
  - *Tube* (color from the Wheels Palette)
- **Handlebar:** Has three subparts:
  - *handlebar_mesh* (main handlebar; use the Handlebar (Main) Palette)
  - *stem_mesh* (handlebar stem; use the Handlebar (Main) Palette)
  - *grip_mesh* (handlebar grips; use the Grip Palette)
- **Saddle:** Has two subparts:
  - *saddleSide_mesh* (main saddle body; use the Saddle Body Palette)
  - *seatPost_mesh* (saddle post; use the Saddle Post Palette)
- **Pedals:** Uses a single color from the Pedals Palette.
- **Chain:** Uses a single color from the Chain Palette.

**Important Instructions:**
- Do **not** include hex codes in your output; only output the color label.
- Generate a weighted color theme by outputting an array of colors with assigned weight values.
  - The order of colors reflects their prominence:
    - The **first color** is the dominant color (for major parts like the Frame and Wheel Rim).
    - The subsequent colors are secondary, tertiary, etc. (for parts like Wheel Tube, Handlebar subparts, Saddle subparts, Pedals, and Chain).
- **Dynamic Color Count:**
  - For single-color inputs, output only the main color with weight 1.0 
  - If the prompt implies two or more colors, output all colors with appropriate weights
  - For themed inputs (e.g., "USA", "rainbow"), output the full set of theme colors
- Additionally, provide a short, concise, and smart message explaining your interpretation. Your explanation should be clear and nuanced. For example, for input "China" you might say:  
  "Interpreted as a dominant red balanced by a subtle yellow detail."

**Available Color Palettes**  
(Only use these color labels):

- **Frame Palette:** [ orange, yellow, darkBlue, babyBlue, purple, green, black, silver, creamClassic, aquaBlue ]
- **Wheels Palette:** [ black, blue, green, orange, pink, purple, red, white, yellow ]
- **Handlebar (Main) Palette:** [ black, gold, silver ]
- **Grip Palette:** [ black, red, orange, yellow, green, blue, purple, pink, white ]
- **Saddle Body Palette:** [ brown, black, white, pink, orange, green, purple, blue, yellow, red ]
- **Saddle Post Palette:** [ black, silver, gold ]
- **Pedals Palette:** [ black, blue, green, orange, pink, purple, red, white, yellow ]
- **Chain Palette:** [ black, silver, gold ]

Output exactly in JSON format with this structure:
{
  "theme": {
    "colors": [
      { "label": "COLOR_NAME", "weight": number },
      { "label": "COLOR_NAME", "weight": number },
      ...
    ]
  },
  "message": "SHORT MINIMAL MESSAGE EXPLAINING THE INTERPRETATION"
}
Do not include any extra text.
`.trim();

    console.log("Sending theme generation request to OpenAI...");
    const themeMessages: ChatCompletionMessageParam[] = [
      { role: "system", content: themeSystemPrompt },
      { role: "user", content: prompt }
    ];

    const themeResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: themeMessages,
      temperature: 0.2,
      max_tokens: 600
    });
    const themeRaw = themeResponse.choices[0].message?.content || '';
    console.log("Theme raw output:", themeRaw);
    let theme;
    try {
      console.log("Parsing theme JSON response...");
      theme = JSON.parse(themeRaw);
    } catch (e) {
      console.error("JSON parsing error for theme:", e);
      throw new Error("Failed to parse theme JSON: " + e);
    }
    // Updated error check: Ensure theme.theme.colors is an array with at least two items.
    if (
      !theme.theme ||
      !Array.isArray(theme.theme.colors) ||
      theme.theme.colors.length < 1
    ) {
      console.error("Invalid theme structure:", theme);
      throw new Error("Invalid theme structure: 'theme.colors' must be an array with at least one item.");
    }
    // Optionally, if message is missing, we can add a default one.
    if (typeof theme.message !== 'string' || theme.message.trim() === "") {
      console.log("No message provided, using default message");
      theme.message = "Style interpreted successfully.";
    }

    // STEP 2: Map the weighted theme to bike parts based on your parameter definitions.
    console.log("Step 2: Mapping colors to bike parts...");
    const mappingSystemPrompt = `
You are a bike style mapper. You are given a weighted color theme in JSON format as shown below:
${JSON.stringify(theme, null, 2)}

Your goal is to map the weighted colors from the theme (i.e. "${JSON.stringify(theme, null, 2)}") to the specific bike parts using only the available color options for each part. Use the weights (1 is highest, 0.1 is lowest) to assign the dominant color to the largest parts and lesser weighted colors to smaller parts.

IMPORTANT:
1. ONLY use colors from the exact palettes listed for each part.
2. Colors are case-sensitive – use the exact names provided.
3. For Frame parts, if a blue tone is needed, use either 'darkBlue' or 'babyBlue'.
4. If a theme color is not available in a part's palette, choose the most similar available color.
5. Always refer back to the theme JSON: "${JSON.stringify(theme, null, 2)}" for the colors and their weights.

Map the colors to these parts and subparts:

1. **Frame**
   - Theme reference: "${JSON.stringify(theme, null, 2)}"
   - Available colors for Frame & Fork: [ orange, yellow, darkBlue, babyBlue, purple, green, black, silver, creamClassic, aquaBlue ]
   - Available colors for Chain: [ black, silver, white, red, orange, yellow, green, blue, purple, pink ]
   
   Subparts:
   - "frame_mesh" – MUST use Frame & Fork colors.
   - "fork_mesh" – MUST use Frame & Fork colors.
   - "chain_mesh" – MUST use Chain colors.
   - If the theme color is not in the available list, choose a similar option.

2. **Rear Wheel**
   - Theme reference: "${JSON.stringify(theme, null, 2)}"
   - Available colors: [ black, blue, green, orange, pink, purple, red, white, yellow ]
   
   Subparts (all MUST use these colors):
   - "Rim"
   - "Tube"
   - "Cog"
   - "Logo"
   - If the theme color is not in the available list, choose a similar option.

3. **Front Wheel**
   - Theme reference: "${JSON.stringify(theme, null, 2)}"
   - Available colors: [ black, blue, green, orange, pink, purple, red, white, yellow ]
   
   Subparts (all MUST use these colors):
   - "Tube"
   - "Rim"
   - "Cog"
   - "Spokes"
   - If the theme color is not in the available list, choose a similar option.

4. **Saddle**
   - Theme reference: "${JSON.stringify(theme, null, 2)}"
   - Available colors for Saddle Body (saddleSide_mesh, saddleTop_mesh, saddleFrame_mesh): [ brown, black, white, pink, orange, green, purple, blue, yellow, red ]
   - Available colors for Saddle Post (seatPost_mesh): [ black, silver, gold ]
   
   Subparts:
   - "saddleSide_mesh" – MUST use Saddle Body colors.
   - "saddleTop_mesh" – MUST use Saddle Body colors.
   - "saddleFrame_mesh" – MUST use Saddle Body colors.
   - "seatPost_mesh" – MUST use Saddle Post colors.
   - If the theme color is not in the available list, choose a similar option.

5. **Handlebar**
   - Theme reference: "${JSON.stringify(theme, null, 2)}"
   - Available colors for Handlebar (handlebar_mesh, stem_mesh, levers_mesh, headsetSpacers_mesh): [ black, gold, silver ]
   - Available colors for Grip (grip_mesh): [ black, red, orange, yellow, green, blue, purple, pink, white ]
   
   Subparts:
   - "handlebar_mesh" – MUST use Handlebar colors.
   - "stem_mesh" – MUST use Handlebar colors.
   - "levers_mesh" – MUST use Handlebar colors.
   - "headsetSpacers_mesh" – MUST use Handlebar colors.
   - "grip_mesh" – MUST use Grip colors.
   - If the theme color is not in the available list, choose a similar option.

6. **Pedals**
   - Theme reference: "${JSON.stringify(theme, null, 2)}"
   - Available colors: [ black, blue, green, orange, pink, purple, red, white, yellow ]
   
   Subparts:
   - "pedalTread_mesh" – MUST use these colors.
   - "pedalShaft_mesh" – MUST use these colors.
   - If the theme color is not in the available list, choose a similar option.

Output exactly in JSON format with this structure:
{
  "configs": [
    { "name": "Frame", "color": { "label": "COLOR_NAME" }, "subParts": [
        { "name": "frame_mesh", "color": { "label": "COLOR_NAME" } },
        { "name": "fork_mesh", "color": { "label": "COLOR_NAME" } },
        { "name": "chain_mesh", "color": { "label": "COLOR_NAME" } }
      ]
    },
    { "name": "Rear Wheel", "subParts": [
        { "name": "Rim", "color": { "label": "COLOR_NAME" } },
        { "name": "Tube", "color": { "label": "COLOR_NAME" } },
        { "name": "Cog", "color": { "label": "COLOR_NAME" } },
        { "name": "Logo", "color": { "label": "COLOR_NAME" } }
      ]
    },
    { "name": "Front Wheel", "subParts": [
        { "name": "Tube", "color": { "label": "COLOR_NAME" } },
        { "name": "Rim", "color": { "label": "COLOR_NAME" } },
        { "name": "Cog", "color": { "label": "COLOR_NAME" } },
        { "name": "Spokes", "color": { "label": "COLOR_NAME" } }
      ]
    },
    { "name": "Saddle", "subParts": [
        { "name": "saddleSide_mesh", "color": { "label": "COLOR_NAME" } },
        { "name": "saddleTop_mesh", "color": { "label": "COLOR_NAME" } },
        { "name": "saddleFrame_mesh", "color": { "label": "COLOR_NAME" } },
        { "name": "seatPost_mesh", "color": { "label": "COLOR_NAME" } }
      ]
    },
    { "name": "Handlebar", "subParts": [
        { "name": "handlebar_mesh", "color": { "label": "COLOR_NAME" } },
        { "name": "stem_mesh", "color": { "label": "COLOR_NAME" } },
        { "name": "levers_mesh", "color": { "label": "COLOR_NAME" } },
        { "name": "headsetSpacers_mesh", "color": { "label": "COLOR_NAME" } },
        { "name": "grip_mesh", "color": { "label": "COLOR_NAME" } }
      ]
    },
    { "name": "Pedals", "subParts": [
        { "name": "pedalTread_mesh", "color": { "label": "COLOR_NAME" } },
        { "name": "pedalShaft_mesh", "color": { "label": "COLOR_NAME" } }
      ]
    }
  ]
}
Do not include any extra text.
`.trim();

    console.log("Sending mapping request to OpenAI...");
    const mappingMessages: ChatCompletionMessageParam[] = [
      { role: "system", content: mappingSystemPrompt },
      { role: "user", content: JSON.stringify(theme) }
    ];

    const mappingResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: mappingMessages,
      temperature: 0.05,
      max_tokens: 700
    });
    const mappingRaw = mappingResponse.choices[0].message?.content || '';
    console.log("Mapping raw output:", mappingRaw);
    let finalResult;
    try {
      console.log("Parsing mapping JSON response...");
      finalResult = JSON.parse(mappingRaw);
    } catch (e) {
      console.error("JSON parsing error for mapping:", e);
      throw new Error("Failed to parse mapping JSON: " + e);
    }
    if (!finalResult.configs || !Array.isArray(finalResult.configs)) {
      console.error("Invalid mapping structure:", finalResult);
      throw new Error("Invalid final mapping JSON structure");
    }

    console.log("Successfully completed bike style mapping");
    return NextResponse.json({ configs: finalResult.configs, message: theme.message });
  } catch (error) {
    console.error("Error in bike style mapping route:", error);
    return NextResponse.json(
      { error: "Failed to generate bike style", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

