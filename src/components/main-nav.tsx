'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { LayoutDashboard, Gamepad2, Trophy, Store, User } from 'lucide-react';

const navItems = [
  { href: '/app', label: 'Dashboard', icon: <LayoutDashboard /> },
  { href: '/app/play', label: 'Play', icon: <Gamepad2 /> },
  { href: '/app/leaderboard', label: 'Leaderboard', icon: <Trophy /> },
  { href: '/app/shop', label: 'Shop', icon: <Store /> },
  { href: '/app/profile', label: 'Profile', icon: <User /> },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <Link href={item.href} legacyBehavior passHref>
            <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.label}>
              <a>
                {item.icon}
                <span>{item.label}</span>
              </a>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
