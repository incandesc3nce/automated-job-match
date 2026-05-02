export type LMStudioGenerateResponse = {
  model_instance_id: string;
  output: {
    type: string;
    content: string;
  }[];
  stats: {
    input_tokens: number;
    total_output_tokens: number;
    reasoning_output_tokens: number;
    tokens_per_second: number;
    time_to_first_token_seconds: number;
  };
};
