'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Typography } from '@/components/ui/typography';
import { APIFetch } from '@/utils/APIFetch';
import { EyeClosed } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type MatchHideProps = {
  matchId: string;
  action: 'hide' | 'unhide';
};

export const MatchHide = ({ matchId, action }: MatchHideProps) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleMatchAction = async () => {
    const result = await APIFetch(`/api/v1/matches/${matchId}/${action}`, {
      method: 'PATCH',
    });

    if (result.success) {
      router.refresh();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={'outline'}>
          <Typography tag="span" className="font-semibold">
            {action === 'hide' ? 'Скрыть' : 'Показать'}
          </Typography>
          <EyeClosed className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <Typography>
              Вы уверены, что хотите {action === 'hide' ? 'скрыть' : 'показать'} эту
              рекомендацию?
            </Typography>
          </DialogTitle>
          <DialogDescription>
            <Typography tag="span" variant="muted">
              Вы всегда можете {action === 'hide' ? 'показать' : 'скрыть'} её снова в
              будущем.
            </Typography>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={handleMatchAction}>
            {action === 'hide' ? 'Скрыть' : 'Показать'}
          </Button>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Отмена
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
