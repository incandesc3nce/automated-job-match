import { Typography } from '@/components/ui/typography';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from '../../ui/sidebar';
import { CvSidebarGroup } from './CvSidebarGroup';
import { NavUser } from './NavUser';
import { ServerAPIFetch } from '@/utils/ServerAPIFetch';
import { CVData } from '@/types/dashboard/cvs/CV';

export async function AppSidebar() {
  const cvsResult = await ServerAPIFetch<CVData[]>('/api/v1/cvs');
  const cvsData = cvsResult.success ? cvsResult.data : [];

  return (
    <Sidebar>
      <SidebarHeader>
      <Typography tag="h2" className="text-2xl text-center font-semibold">
          <Typography tag="span" accent>
            Career
          </Typography>{' '}
          AI
        </Typography>
      </SidebarHeader>
      <SidebarContent>
        <CvSidebarGroup cvsData={cvsData} />
        <SidebarGroup></SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
