'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Typography } from '@/components/ui/typography';
import { CVData } from '@/types/dashboard/cvs/CV';
import { APIFetch } from '@/utils/APIFetch';
import { Trash2 } from 'lucide-react';
import { Dispatch, SetStateAction, useState } from 'react';

type CvDeleteButtonProps = {
  cv: CVData;
  setCvs: Dispatch<SetStateAction<CVData[]>>;
};

export const CvDeleteButton = ({ cv, setCvs }: CvDeleteButtonProps) => {
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    const result = await APIFetch(`/api/v1/cvs/${cv.id}`, {
      method: 'DELETE',
    });

    if (result.success) {
      setCvs((prevCvs) => prevCvs.filter((item) => item.id !== cv.id));
    } else {
      console.error('Error deleting CV:', result.error);
    }

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="border p-1 rounded-lg cursor-pointer">
          <Trash2 className="size-3 text-red-500" />
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <Typography>Вы уверены, что хотите удалить резюме "{cv.title}"?</Typography>
          </DialogTitle>
          <DialogDescription>
            <Typography tag="span" variant="muted" className="">
              Это действие нельзя будет отменить.
            </Typography>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="destructive" onClick={handleDelete}>
            <Typography tag="span">Удалить</Typography>
          </Button>
          <DialogClose asChild>
            <Button variant="outline" className="ml-2">
              <Typography tag="span">Отмена</Typography>
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
