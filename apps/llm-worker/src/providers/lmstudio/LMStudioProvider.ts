import type { GenerateArgs, LLMProvider } from '@/types/LLMProvider';
import type { LMStudioEmbedResponse } from './types/embedding';
import type { LMStudioGenerateResponse } from './types/generate';

export class LMStudioProvider implements LLMProvider {
  constructor(
    private baseUrl: string,
    private completionModel: string,
    private embeddingModel: string,
  ) {}

  async generate({ input, systemPrompt }: GenerateArgs) {
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
        system_prompt: systemPrompt,
        input,
      }),
    });

    if (!res.ok) {
      throw new Error(`LMStudioProvider generate failed: ${await res.text()}`);
    }

    const json = (await res.json()) as LMStudioGenerateResponse;
    const content = json.output.map((o) => o.content).join('\n');

    return content;
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
