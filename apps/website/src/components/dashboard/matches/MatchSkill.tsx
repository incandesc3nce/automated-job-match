import { Typography } from '@/components/ui/typography';

type MatchSkillProps = {
  skill: string;
};

export const MatchSkill = ({ skill }: MatchSkillProps) => {
  return (
    <Typography
      tag="span"
      variant="small"
      className="bg-mist-200 dark:bg-mist-800 p-1 px-2 rounded-2xl">
      {skill}
    </Typography>
  );
};
