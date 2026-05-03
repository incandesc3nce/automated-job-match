export type GenerateArgs = {
  input: string;
  systemPrompt?: string;
};

export interface LLMProvider {
  generate(args: GenerateArgs): Promise<string>;
  embed(text: string): Promise<number[]>;
  healthCheck(): Promise<boolean>;
}
