export type APIFetchResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };
