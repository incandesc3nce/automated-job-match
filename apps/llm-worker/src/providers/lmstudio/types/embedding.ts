export type LMStudioEmbeddingData = {
  object: string;
  embedding: number[];
  index: number;
};

export type LMStudioEmbedResponse = {
  object: string;
  data: LMStudioEmbeddingData[];
  model: string;
  usage: {
    prompt_tokens: number;
    total_tokens: number;
  };
};
