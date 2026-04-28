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

export async function AppSidebar() {


  return (
    <Sidebar>
      <SidebarHeader>
        <Typography tag="h1" className="text-lg font-semibold">
          <Typography tag="span" accent>Career</Typography> AI
        </Typography>
      </SidebarHeader>
      <SidebarContent>
        <CvSidebarGroup />
        <SidebarGroup></SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
