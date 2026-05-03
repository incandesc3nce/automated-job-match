import { createLLMProvider } from './createLLMProvider';

export const llm = createLLMProvider();
const isAvailable = await llm.healthCheck();
if (!isAvailable) {
  console.error(
    'LLM provider is not available. Please check the configuration and try again.',
  );
  process.exit(1);
}
