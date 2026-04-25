import { getCurrentSession } from '@/lib/getCurrentSession';
import Link from 'next/link';
import { Typography } from '../ui/typography';

export const Header = async () => {
  const isLoggedIn = await getCurrentSession();

  return (
    <div className="flex justify-center sticky top-0 z-20">
      <header className="flex items-center justify-between py-2 px-4 mt-4 w-full md:w-3/4 gap-4 bg-blue-100/80 rounded-lg border-2 border-mist-300">
        <Link href='/'>
          <Typography tag="h3">
            <Typography tag="span" accent>
              Career
            </Typography>{' '}
            AI
          </Typography>
        </Link>
        <div className="flex items-center justify-end gap-4">
          {!isLoggedIn && (
            <>
              <Link href="/login">
                <Typography tag="span">Войти</Typography>
              </Link>
              <Link href="/sign-up">
                <Typography tag="span">Регистрация</Typography>
              </Link>
            </>
          )}
          {isLoggedIn && (
            <Link href="/dashboard">
              <Typography tag="span">В личный кабинет</Typography>
            </Link>
          )}
        </div>
      </header>
    </div>
  );
};
