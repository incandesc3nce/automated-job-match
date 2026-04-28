import { Hono } from 'hono';
import { auth } from '@/middlewares/authMiddleware';
import { db, users, eq } from '@career-ai/db';
import { BadRequestError, NotFoundError } from '@/utils/APIError';
import { updateUserValidator, type UpdateUserBody } from './users.validator';
import { hashPassword, verifyPassword } from '@career-ai/auth';

const usersRouter = new Hono().use('*', auth);

usersRouter.get('/me', async (c) => {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, c.get('userId')));

  if (!user) {
    throw new NotFoundError('User not found');
  }

  return c.json({
    id: user.id,
    email: user.email,
    name: user.name,
  });
});

usersRouter.patch('/me', updateUserValidator, async (c) => {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, c.get('userId')));

  if (!user) {
    throw new NotFoundError('User not found');
  }

  const { name, email, oldPassword, newPassword }: UpdateUserBody = await c.req.json();

  const updates: Partial<Omit<typeof user, 'id'>> = {};

  if (name) {
    updates.name = name;
  }

  if (email) {
    updates.email = email;
  }

  if (oldPassword && newPassword) {
    const isOldPasswordValid = await verifyPassword(oldPassword, user.passwordHash);
    if (!isOldPasswordValid) {
      throw new BadRequestError('Old password is incorrect');
    }

    const hashedNewPassword = await hashPassword(newPassword);
    updates.passwordHash = hashedNewPassword;
  }

  await db.update(users).set(updates).where(eq(users.id, user.id));

  return c.json({
    email: updates.email,
    name: updates.name,
  });
});

export default usersRouter;
