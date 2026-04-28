import { cn } from '@/lib/utils';
import { ChildrenProps } from '@/types/ChildrenProps';

type TypographyProps = {
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
  variant?: 'default' | 'lead' | 'large' | 'small' | 'muted';
  accent?: boolean;
  className?: string;
} & ChildrenProps;

const typographyVariants = {
  h1: 'scroll-m-20 text-center text-xl font-extrabold tracking-tight text-balance md:text-2xl',
  h2: 'scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0',
  h3: 'scroll-m-20 text-2xl font-semibold tracking-tight',
  h4: 'scroll-m-20 text-xl font-semibold tracking-tight',
  p: 'leading-7 [&:not(:first-child)]:mt-6',
  span: '',
  default: '',
  lead: 'text-lg font-normal md:text-xl',
  large: 'text-lg font-semibold md:text-xl',
  small: 'text-sm font-medium leading-none',
  muted: 'text-sm text-muted-foreground',
} as const;

export const Typography = ({
  tag = 'p',
  variant = 'default',
  className,
  accent,
  children,
}: TypographyProps) => {
  const Tag = tag;
  const tagClass = typographyVariants[tag];
  const variantClass = typographyVariants[variant];

  return (
    <Tag
      className={cn(
        tagClass,
        variantClass,
        accent ? 'text-blue-600' : '',
        className || '',
      )}>
      {children}
    </Tag>
  );
};
