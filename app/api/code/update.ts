import fs from 'fs/promises';
import path from 'path';

export async function POST(req: Request) {
  const { code } = await req.json();
  const pluginPath = path.resolve(process.cwd(), 'plugin/code.ts');

  await fs.writeFile(pluginPath, code);
  return new Response(JSON.stringify({ success: true }));
}
