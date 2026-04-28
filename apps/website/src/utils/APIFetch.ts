import { APIFetchResult } from '@/types/common/APIFetchResult';

type ClientFetchOptions = Omit<RequestInit, 'body'> & {
  body?: Record<string, unknown>;
};

export const APIFetch = async <T>(
  pathname: `/${string}`,
  options?: ClientFetchOptions,
): Promise<APIFetchResult<T>> => {
  const body = options?.body ? JSON.stringify(options.body) : undefined;
  const shouldUseBasePath = typeof window === 'undefined';
  const url = shouldUseBasePath ? `${process.env.API_BASE_PATH}${pathname}` : pathname;

  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        ...(options?.headers || {}),
        'Content-Type': 'application/json',
      },
      body,
    });

    if (!res.ok) {
      const json = await res.json();
      return {
        success: false,
        message: json.error || 'Ошибка при получении данных',
      };
    }

    const data: T = await res.json();
    return {
      success: true,
      message: data,
    };
  } catch (err) {
    console.error('APIFetch error:', err);
    return {
      success: false,
      message: 'Ошибка при получении данных',
    };
  }
};
