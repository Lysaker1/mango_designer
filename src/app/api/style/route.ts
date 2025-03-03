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
    // Use environment variable for API key
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    const openai = new OpenAI({
      apiKey: apiKey,
    });

    const { prompt } = await request.json();

    const themeSystemPrompt = `
You are a bike style theme generator and mapper. Your task is to analyze a user's freeform styling prompt and generate a weighted color theme that will be mapped to specific bike parts.

**Input Type Analysis:**
- First, determine if the input is requesting a single color, multiple colors, or a theme (country, team, etc.)
- For single color inputs (e.g., "black", "red", "blue"), use ONLY that color with weight 1.0
- For explicit multiple color inputs (e.g., "black and red", "blue with yellow accents"), use those specific colors
- For themed inputs (countries, teams, concepts), use multiple appropriate colors

**Special Country/Flag/Team Handling:**
- When a country or sports team name is provided (e.g., "Sweden", "Norway", "Manchester United"), output ALL the associated colors with appropriate weights.
- For sports teams, ensure their primary colors are prominently represented (Manchester United → red as primary)
- For country flags: determine the primary colors and assign appropriate weights so all colors are well-represented on the bike.

**Color Balance Guidelines (for multi-color themes only):**
- For themed inputs (not single colors), include at least 2-3 colors with appropriate weights.
- Primary colors should have weights between 0.4-0.7
- Secondary colors should have weights between 0.2-0.4
- Accent colors can have weights between 0.1-0.2

**Available Color Palettes**  
(Only use these color labels):

- **Frame Palette:** [ orange, yellow, darkBlue, babyBlue, purple, green, black, silver, creamClassic, aquaBlue, red, white, pink, gold ]
- **Wheels Palette:** [ black, blue, green, orange, pink, purple, red, white, yellow, silver, gold, burgundy, lightBlue, mint, coral, magenta ]
- **Handlebar (Main) Palette:** [ black, gold, silver, white, bronze, red, blue ]
- **Grip Palette:** [ black, red, orange, yellow, green, blue, purple, pink, white, grey, brown, teal, coral ]
- **Saddle Body Palette:** [ brown, black, white, pink, orange, green, purple, blue, yellow, red, grey, tan, burgundy ]
- **Saddle Post Palette:** [ black, silver, gold, white, bronze, red, blue ]
- **Pedals Palette:** [ black, blue, green, orange, pink, purple, red, white, yellow, silver, gold, grey ]
- **Chain Palette:** [ black, silver, gold, bronze, rainbow ]

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
  - Primary colors should have weights between 0.4-0.7
- Secondary colors should have weights between 0.2-0.4
- Accent colors can have weights between 0.1-0.2

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
    console.log("Theme Raw Response:", themeRaw.substring(0, 100) + "...");
    let theme;
    try {
      theme = JSON.parse(themeRaw);
      console.log("Theme Parsed Successfully");
    } catch (e) {
      console.error("Theme Parse Error:", e);
      throw new Error("Failed to parse theme JSON: " + e);
    }

    console.log("Theme structure:", JSON.stringify(theme, null, 2));
    if (!theme || !theme.theme || !theme.theme.colors || !Array.isArray(theme.theme.colors)) {
      throw new Error("Invalid theme structure: " + JSON.stringify(theme, null, 2));
    }

    if (typeof theme.message !== 'string' || theme.message.trim() === "") {
      theme.message = "Style interpreted successfully.";
    }

    const mappingSystemPrompt = `
You are a bike style mapper. You are given a weighted color theme in JSON format as shown below:
${JSON.stringify(theme, null, 2)}

**FUNDAMENTAL COLOR DISTRIBUTION RULES:**
1. NEVER use the same color for more than 60% of visible parts. This is a STRICT REQUIREMENT.
2. For ANY multi-color theme, you MUST distribute ALL colors across visible parts.
3. If there are two colors in the theme (regardless of what they are):
   - The frame should typically use the primary color (higher weight)
   - The wheels MUST use the secondary color(s) for high visibility
   - Accessories (pedals, saddle, grips) should have color variety

   - "pedalShaft_mesh" MUST ALWAYS be black
- "cog" MUST ALWAYS be black
- "frontBrake_mesh" MUST ALWAYS be black
- "rearBrake_mesh" MUST ALWAYS be black
- "wire_mesh" MUST ALWAYS be black
- "levers_mesh" MUST ALWAYS be black or darkGrey
- "Spokes" MUST ALWAYS be black

**Visually Balanced Bike - REQUIRED RULES:**
- Wheels must ALWAYS contrast with the frame color
- No more than 2 consecutive parts can share the same color
- Distribute colors to create visual interest and ensure all theme colors are prominently visible
- Front and rear wheels should generally match each other for visual coherence

**Critical Color Mapping Requirements:**
- For ANY two-color theme, approximately 60% should be primary color, 40% secondary color
- For ANY three-color theme, distribute approximately 40%/30%/30%
- Ensure secondary colors are used on large, visible components (wheels, saddle, etc.)

**Single Color Exception:**
- Only if there is exactly ONE color with weight 1.0, use that color for all parts

**Special Team/Country Flag Handling:**
When mapping colors from sports teams or country flags:
- Always map the primary team/country color to the Frame
- For Manchester United and similar red-dominant teams, always use red for the frame
- Create visually interesting wheel combinations:
  - Front rim and rear rim can be different colors for visual interest
  - Front tube and rear tube should usually match each other
  - Create contrast between rim and tube colors

**Wheel Color Variation Guidelines:**
- Create contrast between rim and tube colors when appropriate
- Front and rear tubes often look best when matching (same color)
- Rims can be different colors from each other for visual interest
- For sports teams and flags, distribute the theme colors across different parts

**Always Find the Best Match:**
- If the exact color isn't available in a palette, use the closest available option
- It's better to pick a similar color than to not update a part
- Map all theme colors to appropriate parts, don't leave colors unused

**Color Mapping Rules for Countries:**
- For "Sweden": Frame should be blue, wheels should be yellow
- For "Norway": Frame should be red, wheels should be blue, accents should be white
- For other countries: Map colors intelligently to showcase all flag colors prominently

**Frame Color Selection:**
- IMPORTANT: Use "darkBlue" for blue frames, NOT "silver" (the default)
- Use "yellow" for yellow frames, NOT a muted version
- For Sweden flag: Frame must be "darkBlue", wheels must be "yellow"
- For Norway flag: Frame must be "red", wheels must be "blue", accents must be "white"

**Required Frame Color Mappings:**
- If theme contains "blue" → use "darkBlue" or "babyBlue" for the frame
- If theme contains "yellow" → use "yellow" for the frame or wheels
- If theme contains "red" → use "red" for the frame or wheels

   - "pedalShaft_mesh" MUST ALWAYS be black
- "cog" MUST ALWAYS be black
- "frontBrake_mesh" MUST ALWAYS be black
- "rearBrake_mesh" MUST ALWAYS be black
- "wire_mesh" MUST ALWAYS be black
- "levers_mesh" MUST ALWAYS be black or darkGrey
- "Spokes" MUST ALWAYS be black

IMPORTANT:
1. ONLY use colors from the exact palettes listed for each part.
2. Colors are case-sensitive – use the exact names provided.
3. For Frame parts, if a blue tone is needed, use either 'darkBlue' or 'babyBlue'.
4. If a theme color is not available in a part's palette, choose the most similar available color.
5. Always refer back to the theme JSON: "${JSON.stringify(theme, null, 2)}" for the colors and their weights.
6. CRITICAL: You MUST use the EXACT part names specified below with the EXACT capitalization and spelling!

Map the colors to these parts and subparts:

1. **Frame**
   - Theme reference: "${JSON.stringify(theme, null, 2)}"
   - Available colors for Frame & Fork: [ orange, yellow, darkBlue, babyBlue, purple, green, black, silver, creamClassic, aquaBlue, red, white, pink, grey, burgundy, lightGreen, chocolate, gold ]
   - Available colors for Chain: [ black, silver, white, red, orange, yellow, green, blue, purple, pink ]
   
   Subparts (USE THESE EXACT NAMES):
   - "frame_mesh" – MUST use Frame & Fork colors.
   - "fork_mesh" – MUST use Frame & Fork colors.
   - "chain_mesh" – MUST use Chain colors.


2. **Rear Wheel**
   - Theme reference: "${JSON.stringify(theme, null, 2)}"
   - Available colors: [ black, blue, green, orange, pink, purple, red, white, yellow ]
   
   Subparts (USE THESE EXACT NAMES):
   - "tube" – MUST use these colors.
   - "rim" – MUST use these colors.
   - "logoFront" – MUST use these colors.
   - "logoBack" – MUST use these colors.

3. **Front Wheel**
   - Theme reference: "${JSON.stringify(theme, null, 2)}"
   - Available colors: [ black, blue, green, orange, pink, purple, red, white, yellow ]
   
   Subparts (USE THESE EXACT NAMES):
   - "tube" – MUST use these colors.
   - "rim" – MUST use these colors.
   - "logoFront" – MUST use these colors.
   - "logoBack" – MUST use these colors.

4. **Saddle**
   - Theme reference: "${JSON.stringify(theme, null, 2)}"
   - Available colors for Saddle Body: [ brown, black, white, pink, orange, green, purple, blue, yellow, red ]
   - Available colors for Saddle Post: [ black, silver, gold ]
   
   Subparts (USE THESE EXACT NAMES):
   - "saddleSide_mesh" – MUST use Saddle Body colors.
   - "saddleTop_mesh" – MUST use Saddle Body colors.
   - "saddleFrame_mesh" – MUST use Saddle Body colors.
   - "seatPost_mesh" – MUST use Saddle Post colors.

5. **Handlebar**
   - Theme reference: "${JSON.stringify(theme, null, 2)}"
   - Available colors for Handlebar parts: [ black, gold, silver ]
   - Available colors for Grip: [ black, red, orange, yellow, green, blue, purple, pink, white ]
   
   Subparts (USE THESE EXACT NAMES):
   - "handlebar_mesh" – MUST use Handlebar colors.
   - "stem_mesh" – MUST use Handlebar colors.
   - "levers_mesh" – MUST use Handlebar colors.
   - "headsetSpacers_mesh" – MUST use Handlebar colors.
   - "wire_mesh" – MUST use black.
   - "grip_mesh" – MUST use Grip colors.

6. **Pedals**
   - Theme reference: "${JSON.stringify(theme, null, 2)}"
   - Available colors: [ black, blue, green, orange, pink, purple, red, white, yellow ]
   
   Subparts (USE THESE EXACT NAMES):
   - "pedalTread_mesh" – MUST use these colors.
   - "pedalShaft_mesh" – MUST use these colors.

Output exactly in JSON format with this structure:
{
  "configs": [
    { "name": "Frame", "color": { "label": "COLOR_NAME" }, "subParts": [
        { "name": "frame_mesh", "color": { "label": "COLOR_NAME" } },
        { "name": "fork_mesh", "color": { "label": "COLOR_NAME" } },
        { "name": "chain_mesh", "color": { "label": "COLOR_NAME" } },

      ]
    },
    { "name": "Rear Wheel", "subParts": [
        { "name": "tube", "color": { "label": "COLOR_NAME" } },
        { "name": "rim", "color": { "label": "COLOR_NAME" } },

      ]
    },
    { "name": "Front Wheel", "subParts": [
        { "name": "tube", "color": { "label": "COLOR_NAME" } },
        { "name": "rim", "color": { "label": "COLOR_NAME" } },

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
        { "name": "stem_mesh", "color": { "label": "COLOR_NAME" } },
        { "name": "handlebar_mesh", "color": { "label": "COLOR_NAME" } },
        { "name": "grip_mesh", "color": { "label": "COLOR_NAME" } },
        { "name": "levers_mesh", "color": { "label": "COLOR_NAME" } },
        { "name": "headsetSpacers_mesh", "color": { "label": "COLOR_NAME" } },
      ]
    },
    { "name": "Pedals", "subParts": [
        { "name": "pedalTread_mesh", "color": { "label": "COLOR_NAME" } },
      ]
    }
  ]
}
Do not include any extra text.
`.trim();

    const mappingMessages: ChatCompletionMessageParam[] = [
      { role: "system", content: mappingSystemPrompt },
      { role: "user", content: JSON.stringify(theme) }
    ];

    const mappingResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: mappingMessages,
      temperature: 0.05,
      max_tokens: 1500
    });
    const mappingRaw = mappingResponse.choices[0].message?.content || '';
    console.log("Mapping Raw Response:", mappingRaw.substring(0, 5000) + "...");
    let finalResult;
    try {
      finalResult = JSON.parse(mappingRaw);
      console.log("Mapping Parsed Successfully");
    } catch (e) {
      console.error("Mapping Parse Error:", e, "Full Response:", mappingRaw);
      throw new Error("Failed to parse mapping JSON: " + e);
    }
    if (!finalResult.configs || !Array.isArray(finalResult.configs)) {
      throw new Error("Invalid final mapping JSON structure");
    }

    return NextResponse.json({ configs: finalResult.configs, message: theme.message });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate bike style", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
