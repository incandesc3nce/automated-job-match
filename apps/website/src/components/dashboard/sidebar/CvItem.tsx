import { SidebarMenuSubButton, SidebarMenuSubItem } from '@/components/ui/sidebar';
import { Typography } from '@/components/ui/typography';
import { CvEditButton } from './CvEditButton';
import { CvDeleteButton } from './CvDeleteButton';
import { CVData } from '@/types/dashboard/cvs/CV';
import { SetState } from '@/types/common/SetState';

type CvItemProps = {
  cv: CVData;
  setCvs: SetState<CVData[]>;
};

export const CvItem = ({ cv, setCvs }: CvItemProps) => {
  return (
    <SidebarMenuSubItem className="flex items-center">
      <SidebarMenuSubButton
        asChild
        className="w-full cursor-pointer flex-1 min-h-8 h-auto wrap-break-word">
        <Typography tag="p" className="text-sm">
          {cv.title}
        </Typography>
      </SidebarMenuSubButton>
      <div className="flex items-center gap-2 ml-auto">
        <CvEditButton cv={cv} setCvs={setCvs} />
        <CvDeleteButton cv={cv} setCvs={setCvs} />
      </div>
    </SidebarMenuSubItem>
  );
};
