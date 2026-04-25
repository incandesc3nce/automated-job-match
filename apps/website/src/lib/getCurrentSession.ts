import { JwtPayload, verifyJwt } from '@career-ai/auth';
import { cookies } from 'next/headers';

export const getCurrentSession = async (): Promise<JwtPayload | null> => {
  const token = (await cookies()).get('token')?.value ?? null;

  if (!token) {
    return null;
  }

  const result = verifyJwt(token);

  return result;
};
