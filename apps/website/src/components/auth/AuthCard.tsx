import { ChildrenProps } from '@/types/ChildrenProps';
import { Card, CardDescription, CardHeader, CardTitle } from '../ui/card';

type AuthCardProps = {
  title: string;
  description: string;
} & ChildrenProps;

export const AuthCard = ({ title, description, children }: AuthCardProps) => {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      {/* CardContent and CardFooter are separate for login and sign-up */}
      {children}
    </Card>
  );
};
