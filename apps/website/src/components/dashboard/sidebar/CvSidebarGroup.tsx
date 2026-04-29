'use client';

import { CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
} from '@/components/ui/sidebar';
import { Typography } from '@/components/ui/typography';
import { FileUser, ChevronRight } from 'lucide-react';
import { Collapsible } from '@/components/ui/collapsible';
import { CVData } from '@/types/dashboard/cvs/CV';
import { useState } from 'react';
import { CvItem } from './CvItem';
import { CvAddButton } from './CvAddButton';

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
                  <CvItem key={cv.id} cv={cv} setCvs={setCvs} />
                ))}
                <CvAddButton setCvs={setCvs} />
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      </SidebarMenu>
    </SidebarGroup>
  );
};
