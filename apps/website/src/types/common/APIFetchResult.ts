export type APIFetchResult<T> = {
  success: boolean;
  message: T | string;
};