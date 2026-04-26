import { hash, verify } from 'argon2';
import jwt from 'jsonwebtoken';

export type JwtPayload = {
  userId: string;
  email: string;
  name: string;
};

const HASH_SECRET = process.env['HASH_SECRET']!;
const JWT_SECRET = process.env['JWT_SECRET']!;
const expiresIn = '3d';

// Hashing and verifying passwords using argon2
export const hashPassword = async (password: string): Promise<string> => {
  const hashedPassword = await hash(password, { secret: Buffer.from(HASH_SECRET) });
  return hashedPassword;
};

export const verifyPassword = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  const isValid = await verify(hashedPassword, password, {
    secret: Buffer.from(HASH_SECRET),
  });
  return isValid;
};

// Generating and verifying JWTs using jsonwebtoken
export const signJwt = (payload: JwtPayload) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn,
  });
};

export const verifyJwt = (token: string): JwtPayload => {
  const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
  return decoded;
};
