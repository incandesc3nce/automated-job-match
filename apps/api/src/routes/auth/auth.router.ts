import { Hono } from 'hono';
import { db, users, eq } from '@career-ai/db';
import { hashPassword, signJwt, verifyPassword } from '@career-ai/auth';
import { BadRequestError, InternalServerError } from '@/utils/APIError';
import {
  signUpValidator,
  loginValidator,
  type SignUpBody,
  type LoginBody,
} from './auth.validator';
import { setCookie } from 'hono/cookie';

const authRouter = new Hono();

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  maxAge: 60 * 60 * 24 * 3, // 3 days
  sameSite: 'Lax' as const,
  path: '/',
};

authRouter.post('/sign-up', signUpValidator, async (c) => {
  const { name, email, password }: SignUpBody = await c.req.json();

  // Check if user already exists
  const [existingUser] = await db
    .select()
    .from(users)
    .where(eq(users.email, email.toLowerCase()));

  if (existingUser) {
    throw new BadRequestError('User with this email already exists');
  }

  const passwordHash = await hashPassword(password);
  const [newUser] = await db
    .insert(users)
    .values({
      name,
      email,
      passwordHash: passwordHash,
    })
    .returning();

  if (!newUser) {
    throw new InternalServerError('Failed to create user');
  }

  const token = signJwt({ userId: newUser.id, email: newUser.email, name: newUser.name });

  setCookie(c, 'token', token, COOKIE_OPTIONS);

  return c.json(
    {
      name: newUser.name,
      email: newUser.email,
    },
    201,
  );
});

authRouter.post('/login', loginValidator, async (c) => {
  const { email, password }: LoginBody = await c.req.json();

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email.toLowerCase()));
  if (!user) {
    throw new BadRequestError('Invalid email or password');
  }

  const isValidPassword = await verifyPassword(password, user.passwordHash);
  if (!isValidPassword) {
    throw new BadRequestError('Invalid email or password');
  }

  const token = signJwt({ userId: user.id, email: user.email, name: user.name });

  setCookie(c, 'token', token, COOKIE_OPTIONS);

  return c.json({
    name: user.name,
    email: user.email,
  });
});

export default authRouter;
