'use client';

import { Typography } from '@/components/ui/typography';
import { Match } from '@/types/dashboard/matches/Match';
import Link from 'next/link';
import { MatchSkill } from './MatchSkill';
import { sourceToImageMap } from '@/utils/sourceToImageMap';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import { MatchSalary } from './MatchSalary';
import { MatchScore } from './MatchScore';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { workFormatMap } from '@/utils/workFormatMap';

type MatchArticleProps = {
  match: Match;
};

export const MatchArticle = ({ match }: MatchArticleProps) => {
  const sourceImage = sourceToImageMap[match.jobSource];
  const [isRevealedDesc, setIsRevealedDesc] = useState(false);

  return (
    <article className="flex flex-col border p-4 rounded-md bg-mist-50 dark:bg-mist-900">
      <div className="space-y-2">
        <Link
          href={match.externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 hover:underline">
          <Typography tag="h3">{match.jobTitle}</Typography>
          <Image src={sourceImage} alt={match.jobSource} width={32} height={32} />
        </Link>
        <div className="flex items-center gap-4">
          <Typography tag="span">
            <Typography tag="span" className="font-semibold">
              Компания:
            </Typography>{' '}
            {match.jobCompanyName}
          </Typography>
          <Separator orientation="vertical" className="border-x" />
          <Typography tag="span">
            <Typography tag="span" className="font-semibold">
              Местоположение:
            </Typography>{' '}
            {match.jobLocation}
          </Typography>
        </div>

        {(match.jobSalaryFrom || match.jobSalaryTo) && (
          <MatchSalary
            salaryFrom={match.jobSalaryFrom}
            salaryTo={match.jobSalaryTo}
            salaryExtra={match.jobSalaryExtra}
          />
        )}

        <div>
          <Typography tag="span" className="font-semibold">
            Формат работы:
          </Typography>{' '}
          {match.jobWorkFormat
            .map((format) => workFormatMap[format] || format)
            .join(', ')}
        </div>

        {match.jobSkills.length > 0 && (
          <div>
            <Typography tag="span" className="font-semibold">
              Требуемые навыки:
            </Typography>{' '}
            <div className="inline-flex items-center gap-2 flex-wrap">
              {match.jobSkills.map((skill, index) => (
                <MatchSkill key={`${skill}-${index}`} skill={skill} />
              ))}
            </div>
          </div>
        )}

        <div>
          <Typography tag="span" className="font-semibold">
            Опубликовано:
          </Typography>{' '}
          {new Date(match.jobPostedAt).toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 mt-4">
        <Button onClick={() => setIsRevealedDesc(!isRevealedDesc)}>
          {isRevealedDesc ? 'Скрыть описание' : 'Показать описание'}
        </Button>
        <MatchScore score={match.score} reasoning={match.reasoning} />
      </div>

      {isRevealedDesc && (
        <div className="mt-4">
          <Typography tag="span" className="font-semibold">
            Описание вакансии:
          </Typography>
          <Typography tag="p" className="mb-4">
            {match.jobDescription}
          </Typography>

          <Link href={match.externalUrl} target="_blank" rel="noopener noreferrer">
            <Button>Перейти к вакансии</Button>
          </Link>
        </div>
      )}
    </article>
  );
};
