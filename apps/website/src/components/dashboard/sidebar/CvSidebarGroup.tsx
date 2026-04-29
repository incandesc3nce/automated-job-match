'use client';

import { CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from '@/components/ui/sidebar';
import { Typography } from '@/components/ui/typography';
import { FileUser, ChevronRight } from 'lucide-react';
import { Collapsible } from '@/components/ui/collapsible';
import { CVData } from '@/types/dashboard/cvs/CV';
import { CvEditButton } from './CvEditButton';
import { CvDeleteButton } from './CvDeleteButton';
import { useState } from 'react';

type CvSidebarGroupProps = {
  cvsData: CVData[];
};

export const CvSidebarGroup = ({ cvsData }: CvSidebarGroupProps) => {
  const [cvs, setCvs] = useState<CVData[]>(cvsData);

  return (
    <SidebarGroup>
      <SidebarMenu>
        <Collapsible asChild defaultOpen={true} className="group/collapsible">
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton>
                <FileUser />
                <Typography tag="span">Резюме</Typography>
                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {cvs.map((cv) => (
                  <SidebarMenuSubItem key={cv.id} className="flex items-center">
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
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      </SidebarMenu>
    </SidebarGroup>
  );
};
