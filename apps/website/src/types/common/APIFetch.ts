export type APIFetchResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export type ClientFetchOptions = Omit<RequestInit, 'body'> & {
  body?: Record<string, unknown>;
};
