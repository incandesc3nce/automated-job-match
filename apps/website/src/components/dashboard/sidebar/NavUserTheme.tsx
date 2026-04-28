'use client';

import { Laptop, Moon, MoonStar, Sun } from 'lucide-react';
import {
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '../../ui/dropdown-menu';
import { useTheme } from 'next-themes';

export const NavUserTheme = () => {
  const { setTheme } = useTheme();

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <MoonStar />
        Тема
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent>
          <DropdownMenuItem onClick={() => setTheme('light')}>
            <Sun />
            Светлая тема
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme('dark')}>
            <Moon />
            Тёмная тема
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme('system')}>
            <Laptop />
            Системная тема
          </DropdownMenuItem>
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  );
};
