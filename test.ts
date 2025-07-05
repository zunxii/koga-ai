import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';
import * as readline from 'readline';
import * as dotenv from 'dotenv';

dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function askAI(prompt: string) {
  try {
    const { text } = await generateText({
      model: openai('gpt-4o'),
      prompt: prompt,
      temperature: 0.7,
      maxTokens: 3000,
    });
    return text;
  } catch (error) {
    return `Error: ${error.message}`;
  }
}

async function startChat() {
  console.log("🤖 AI Terminal Chat (type 'exit' to quit)");
  console.log("=" .repeat(40));

  const chat = () => {
    rl.question('\n You: ', async (input) => {
      if (input.toLowerCase() === 'exit') {
        rl.close();
        return;
      }

      console.log('\n🤖 AI: Thinking...');
      const response = await askAI(input);
      console.log(`🤖 AI: ${response}`);
      
      chat(); // Continue conversation
    });
  };

  chat();
}

startChat();