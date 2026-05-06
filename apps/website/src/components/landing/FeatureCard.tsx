import { LucideIcon } from 'lucide-react';
import { Typography } from '../ui/typography';

type FeatureCardProps = {
  Icon: LucideIcon;
  title: string;
  description: string;
};

export const FeatureCard = ({ Icon, title, description }: FeatureCardProps) => {
  return (
    <div className="flex flex-col p-6 rounded-2xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-mist-800 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 text-blue-600 dark:text-blue-400 dark:bg-mist-900 shrink-0">
          <Icon className="w-6 h-6" />
        </div>
        <Typography tag="h3" className="text-xl font-semibold">
          {title}
        </Typography>
      </div>
      <Typography tag="span">{description}</Typography>
    </div>
  );
};
