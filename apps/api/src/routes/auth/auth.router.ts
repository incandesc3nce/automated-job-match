import { Hono } from 'hono';
import { db, users, eq } from '@career-ai/db';
import { hashPassword, signJwt } from '@career-ai/auth';
import { BadRequestError, InternalServerError } from '@/utils/APIError';
import { signUpValidator, loginValidator } from './auth.validator';

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

  return c.json({
    name: newUser.name,
    email: newUser.email,
    token,
  });
});

authRouter.post('/login', loginValidator, async (c) => {
  const { email, password } = await c.req.json();

  const [user] = await db.select().from(users).where(eq(users.email, email));
  const hashedPassword = await hashPassword(password);
  if (!user) {
    throw new BadRequestError('Invalid email or password');
  }
  if (user.password_hash !== hashedPassword) {
    throw new BadRequestError('Invalid email or password');
  }

  const token = signJwt({ userId: user.id });

  return c.json({
    name: user.name,
    email: user.email,
    token,
  });
});

export default authRouter;
