import { Hono } from 'hono';
import { db, users, eq } from '@career-ai/db';
import { hashPassword, signJwt, verifyPassword } from '@career-ai/auth';
import { BadRequestError, InternalServerError } from '@/utils/APIError';
import { signUpValidator, loginValidator } from './auth.validator';
import { setCookie } from 'hono/cookie';

const authRouter = new Hono();

authRouter.post('/sign-up', signUpValidator, async (c) => {
  const { name, email, password } = await c.req.json();

  // Check if user already exists
  const [existingUser] = await db.select().from(users).where(eq(users.email, email));

  if (existingUser) {
    throw new BadRequestError('User with this email already exists');
  }

  const passwordHash = await hashPassword(password);
  const [newUser] = await db
    .insert(users)
    .values({
      name,
      email,
      password_hash: passwordHash,
    })
    .returning();

  if (!newUser) {
    throw new InternalServerError('Failed to create user');
  }

  const token = signJwt({ userId: newUser.id });

  setCookie(c, 'token', token, {
    httpOnly: true,
    secure: true,
    maxAge: 60 * 60 * 24 * 3,
    sameSite: 'Lax',
    path: '/'
  });

  return c.json({
    name: newUser.name,
    email: newUser.email,
  });
});

authRouter.post('/login', loginValidator, async (c) => {
  const { email, password } = await c.req.json();

  const [user] = await db.select().from(users).where(eq(users.email, email));
  if (!user) {
    throw new BadRequestError('Invalid email or password');
  }

  const isValidPassword = await verifyPassword(password, user.password_hash);
  if (!isValidPassword) {
    throw new BadRequestError('Invalid email or password');
  }

  const token = signJwt({ userId: user.id });

  setCookie(c, 'token', token, {
    httpOnly: true,
    secure: true,
    maxAge: 60 * 60 * 24 * 3,
    sameSite: 'Lax',
    path: '/'
  });

  return c.json({
    name: user.name,
    email: user.email,
  });
});

export default authRouter;
