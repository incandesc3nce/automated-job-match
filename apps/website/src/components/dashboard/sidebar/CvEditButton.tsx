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
import { PencilLine } from 'lucide-react';
import { useState } from 'react';
import { CvForm } from './CvForm';
import { SetState } from '@/types/common/SetState';

type CvEditButtonProps = {
  cv: CVData;
  setCvs: SetState<CVData[]>;
};

export const CvEditButton = ({ cv, setCvs }: CvEditButtonProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="border p-1 rounded-lg cursor-pointer">
          <PencilLine className="size-3" />
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <Typography>Редактирование резюме "{cv.title}"</Typography>
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <CvForm action="edit" cv={cv} setCvs={setCvs} setOpen={setOpen} />
        <DialogFooter>
          <Button type="submit" form={`cv-form-${cv.id}`}>
            <Typography tag="span">Сохранить</Typography>
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
