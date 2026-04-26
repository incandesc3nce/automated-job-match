type ClientFetchOptions = Omit<RequestInit, 'body'> & {
  body?: Record<string, unknown>;
};

export const ClientFetch = async (
  pathname: `/${string}`,
  options: ClientFetchOptions,
) => {
  const body = options?.body ? JSON.stringify(options.body) : undefined;
  try {
    const res = await fetch(pathname, {
      ...options,
      headers: {
        ...(options.headers || {}),
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

    const data = await res.json();
    return {
      success: true,
      message: data,
    };
  } catch (err) {
    console.error('ClientFetch error:', err);
    return {
      success: false,
      message: 'Ошибка при получении данных',
    };
  }
};
