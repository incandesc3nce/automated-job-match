import type { cvs, jobs } from '@career-ai/db';
import type { LLMProvider } from '@/types/LLMProvider';
import type { LMStudioEmbedResponse } from '@/types/lmstudio/embedding';
import type { LMStudioGenerateResponse } from '@/types/lmstudio/generate';
import type { Match } from '@/types/Match';
import { buildMatchPrompt, SYSTEM_PROMPT } from '@/utils/prompts';

export class LMStudioProvider implements LLMProvider {
  constructor(
    private baseUrl: string,
    private completionModel: string,
    private embeddingModel: string,
  ) {}

  async generate(cv: typeof cvs.$inferSelect, job: typeof jobs.$inferSelect) {
    const res = await fetch(`${this.baseUrl}/api/v1/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.completionModel,
        stream: false,
        temperature: 0.1,
        reasoning: 'off',
        store: false,
        system_prompt: SYSTEM_PROMPT,
        input: buildMatchPrompt(cv, job),
      }),
    });

    if (!res.ok) {
      throw new Error(`LMStudioProvider generate failed: ${await res.text()}`);
    }

    const json = (await res.json()) as LMStudioGenerateResponse;
    const content = json.output.map((o) => o.content).join('\n');
    const match: Match = JSON.parse(content);

    return match;
  }

  async embed(text: string) {
    const res = await fetch(`${this.baseUrl}/v1/embeddings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.embeddingModel,
        input: text,
      }),
    });

    if (!res.ok) {
      throw new Error(`LMStudioProvider embed failed: ${res.statusText}`);
    }

    const json = (await res.json()) as LMStudioEmbedResponse;
    const flatEmbeddings = json.data.flatMap((d) => d.embedding);

    return flatEmbeddings;
  }

  async healthCheck() {
    try {
      const res = await fetch(`${this.baseUrl}/api/v1/models/`);
      if (!res.ok) {
        throw new Error(await res.text());
      }

      return true;
    } catch (err) {
      console.error('LMStudioProvider health check failed:', err);
      return false;
    }
  }
}
