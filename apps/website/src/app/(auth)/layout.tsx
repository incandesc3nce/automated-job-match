import { Header } from '@/components/common/Header';
import { ChildrenProps } from '@/types/ChildrenProps';

export default function AuthLayout({ children }: ChildrenProps) {
  return (
    <div className="flex flex-col gap-16">
      <Header />
      <main>{children}</main>
    </div>
  );
}
