export function extractTSCodeBlocks(text: string): string | null {
  const match = text.match(/```ts([\s\S]*?)```/);
  return match ? match[1].trim() : null;
}
