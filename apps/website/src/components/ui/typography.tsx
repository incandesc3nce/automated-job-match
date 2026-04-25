import { ChildrenProps } from '@/types/ChildrenProps';

type TypographyProps = {
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
  variant?: 'default' | 'lead' | 'large' | 'small' | 'muted';
  className?: string;
} & ChildrenProps;

const typographyVariants = {
  h1: 'scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance md:text',
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
  children,
}: TypographyProps) => {
  const Tag = tag;
  const tagClass = typographyVariants[tag];
  const variantClass = typographyVariants[variant];

  return (
    <Tag className={`${tagClass} ${variantClass} ${className || ''}`}>{children}</Tag>
  );
};
