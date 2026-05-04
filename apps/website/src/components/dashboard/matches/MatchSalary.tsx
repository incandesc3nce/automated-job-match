import { Typography } from '@/components/ui/typography';

type MatchSalaryProps = {
  salaryFrom: string | null;
  salaryTo: string | null;
  salaryExtra: string | null;
};

export const MatchSalary = ({ salaryFrom, salaryTo, salaryExtra }: MatchSalaryProps) => {
  return (
    <div>
      <Typography tag="span" className="font-semibold">
        Зарплата:
      </Typography>{' '}
      {salaryFrom && `от ${salaryFrom}`} {salaryFrom && salaryTo && '-'}{' '}
      {salaryTo && `до ${salaryTo}`} {salaryExtra}
    </div>
  );
};
