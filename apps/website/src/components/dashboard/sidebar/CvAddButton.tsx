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
import { SidebarMenuSubButton, SidebarMenuSubItem } from '@/components/ui/sidebar';
import { Typography } from '@/components/ui/typography';
import { CvForm } from './CvForm';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { SetState } from '@/types/common/SetState';
import { CVData } from '@/types/dashboard/cvs/CV';

type CvAddButtonProps = {
  setCvs: SetState<CVData[]>;
};

export const CvAddButton = ({ setCvs }: CvAddButtonProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <SidebarMenuSubItem className="flex items-center">
          <SidebarMenuSubButton
            asChild
            className="w-full cursor-pointer flex-1 min-h-8 h-auto wrap-break-word">
            <Typography tag="p" className="text-sm">
              + Добавить резюме
            </Typography>
          </SidebarMenuSubButton>
        </SidebarMenuSubItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <Typography>Создание нового резюме</Typography>
          </DialogTitle>
          <DialogDescription>
            Заполните форму, чтобы создать новое резюме. Вы сможете отредактировать его
            позже.
          </DialogDescription>
        </DialogHeader>
        <CvForm action="create" setOpen={setOpen} setCvs={setCvs} />
        <DialogFooter>
          <Button type="submit" form={`cv-form-new`}>
            <Typography tag="span">Создать</Typography>
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
