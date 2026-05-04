import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Typography } from '@/components/ui/typography';
import { Info } from 'lucide-react';

type MatchScoreProps = {
  score: number;
  reasoning: string;
};

export const MatchScore = ({ score, reasoning }: MatchScoreProps) => {
  let { textColor, bgColor } = { textColor: '', bgColor: '' };

  if (score >= 75) {
    textColor = 'text-green-700 dark:text-green-300';
    bgColor = 'bg-green-100 dark:bg-green-700/30';
  } else if (score >= 50) {
    textColor = 'text-yellow-700 dark:text-yellow-300';
    bgColor = 'bg-yellow-100 dark:bg-yellow-700/30';
  } else {
    textColor = 'text-red-700 dark:text-red-300';
    bgColor = 'bg-red-100 dark:bg-red-700/30';
  }

  return (
    <Tooltip>
      <TooltipTrigger
        className={`flex items-center gap-2 border px-2 py-1 rounded-lg ${textColor} ${bgColor}`}>
        <Info className="size-4" />
        <Typography tag="span">Подходит на {score}%</Typography>
      </TooltipTrigger>
      <TooltipContent>
        <Typography tag="span">{reasoning}</Typography>
      </TooltipContent>
    </Tooltip>
  );
};
