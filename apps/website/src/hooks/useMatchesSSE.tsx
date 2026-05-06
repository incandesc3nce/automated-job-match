'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const useMatchesSSE = (cvId: string | null) => {
  const router = useRouter();

  useEffect(() => {
    if (!cvId) return;
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_PATH!
    const es = new EventSource(`${baseUrl}/api/v1/cvs/${cvId}/matches/sse`, {
      withCredentials: true,
    });

    es.addEventListener('matchesReady', (e) => {
      const payload: { cvId: string } = JSON.parse(e.data);
      if (payload.cvId !== cvId) {
        return;
      }

      router.refresh();
    });

    es.addEventListener('heartbeat', (e) => {
      console.log('heartbeat', e.data);
    });

    es.onerror = (e) => {
      console.error('SSE error', e);
      es.close();
    };

    return () => {
      es.close();
    };
  }, [cvId]);

  return null;
};
