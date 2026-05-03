import { APIFetchResult, ClientFetchOptions } from '@/types/common/APIFetch';
import { cookies } from 'next/headers';

export const ServerAPIFetch = async <T>(
  pathname: `/${string}`,
  options?: ClientFetchOptions,
): Promise<APIFetchResult<T>> => {
  const body = options?.body ? JSON.stringify(options.body) : undefined;
  const token = (await cookies()).get('token')?.value;

  try {
    const res = await fetch(`${process.env.API_BASE_PATH}${pathname}`, {
      ...options,
      headers: {
        ...(options?.headers || {}),
        'Content-Type': 'application/json',
        Cookie: `token=${token}`,
      },
      body,
    });

    if (!res.ok) {
      const json = await res.json();
      return {
        success: false,
        error: json.error || 'Ошибка при получении данных',
      };
    }

    const data = await res.json() as T;
    return {
      success: true,
      data,
    };
  } catch (err) {
    console.error('APIFetch error:', err);
    return {
      success: false,
      error: 'Ошибка при получении данных',
    };
  }
};
