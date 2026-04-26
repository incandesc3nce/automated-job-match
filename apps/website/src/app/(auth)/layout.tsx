import { Header } from '@/components/common/Header';
import { getCurrentSession } from '@/lib/getCurrentSession';
import { ChildrenProps } from '@/types/ChildrenProps';
import { redirect } from 'next/navigation';

export default async function AuthLayout({ children }: ChildrenProps) {
  const user = await getCurrentSession();
  if (user) {
    redirect('/dashboard');
  }

  return (
    <div className="flex flex-col gap-16">
      <Header />
      <main>{children}</main>
    </div>
  );
}
