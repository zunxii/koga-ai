import { NextRequest, NextResponse } from 'next/server';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { HumanMessage, SystemMessage, AIMessage } from '@langchain/core/messages';
import { StringOutputParser } from '@langchain/core/output_parsers';

// Initialize the Google Gemini model
const model = new ChatGoogleGenerativeAI({
  model: 'gemini-2.0-flash',
  temperature: 0.7,
  apiKey: process.env.GOOGLE_API_KEY,
});

const outputParser = new StringOutputParser();

// System prompt for Figma code generation
const SYSTEM_PROMPT = `You are KOGA AI, an expert AI assistant that generates Figma plugin code based on user descriptions. 

Your role is to:
1. Convert natural language UI descriptions into TypeScript code that can be executed in a Figma-like canvas
2. Generate clean, functional code that creates UI elements using Figma API methods
3. Focus on creating practical, working code that will render in the canvas
4. DO NOT wrap code in JSON blocks - provide raw TypeScript code only

Guidelines for code generation:
- Use Figma API methods like figma.createFrame(), figma.createText(), figma.createRectangle(), figma.createEllipse()
- Set proper dimensions, colors, and styling properties
- Position elements logically with x, y coordinates
- Use proper color values (0-1 range for RGB)
- Create responsive layouts when appropriate
- Include meaningful names for elements

Available Figma API methods:
- figma.createFrame(): Creates a frame container
- figma.createRectangle(): Creates a rectangle shape
- figma.createEllipse(): Creates an ellipse/circle
- figma.createText(): Creates text elements
- figma.currentPage.appendChild(node): Adds element to canvas

Example code structure:
const frame = figma.createFrame();
frame.name = "Login Form";
frame.x = 100;
frame.y = 100;
frame.width = 300;
frame.height = 400;
frame.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
figma.currentPage.appendChild(frame);

const button = figma.createRectangle();
button.name = "Submit Button";
button.x = 120;
button.y = 320;
button.width = 160;
button.height = 40;
button.fills = [{ type: "SOLID", color: { r: 0.2, g: 0.4, b: 0.8 } }];
button.cornerRadius = 8;
figma.currentPage.appendChild(button);

Always provide working TypeScript code that creates visual elements on the canvas.`;
export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required and must be a string' },
        { status: 400 }
      );
    }

    const messages = [
      new SystemMessage(SYSTEM_PROMPT),
      ...(history || []).map((msg: any) => 
        msg.role === 'user' 
          ? new HumanMessage(msg.content)
          : new AIMessage(msg.content)
      ),
      new HumanMessage(message)
    ];

    // Create the chain and invoke directly
    const chain = model.pipe(outputParser);
    const response = await chain.invoke(messages);

    return NextResponse.json({ response });

  } catch (error: any) {
    console.error('Error in chat API:', error);
    
    // Handle specific errors
    if (error.message?.includes('API key')) {
      return NextResponse.json(
        { error: 'Invalid API key configuration' },
        { status: 401 }
      );
    }

    if (error.message?.includes('rate limit')) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to generate response. Please try again.' },
      { status: 500 }
    );
  }
}