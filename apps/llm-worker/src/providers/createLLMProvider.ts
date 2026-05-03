import { LMStudioProvider } from './LMStudioProvider';

type EnvProvider = 'lmstudio' | string | undefined;

export const createLLMProvider = () => {
  const provider: EnvProvider = process.env.LLM_PROVIDER;

  switch (provider) {
    case 'lmstudio':
      return new LMStudioProvider(
        process.env.LM_STUDIO_BASE_URL || 'http://localhost:1234',
        process.env.LM_STUDIO_COMPLETION_MODEL || 'qwen/qwen3.5-9b',
        process.env.LM_STUDIO_EMBEDDING_MODEL || 'text-embedding-qwen3-embedding-0.6b',
      );
    default:
      throw new Error(`Unsupported LLM provider: ${provider}`);
  }
};
