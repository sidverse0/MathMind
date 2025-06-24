import { Sidebar, SidebarProvider, SidebarTrigger, SidebarInset, SidebarHeader, SidebarContent, SidebarFooter } from '@/components/ui/sidebar';
import { MainNav } from '@/components/main-nav';
import { UserNav } from '@/components/user-nav';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { BrainCircuit, LogOut } from 'lucide-react';
import Link from 'next/link';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background">
        <Sidebar>
          <div className="flex flex-col h-full">
            <SidebarHeader>
                <Link href="/app" className='flex items-center gap-2'>
                    <BrainCircuit className="h-8 w-8 text-primary" />
                    <h1 className="text-2xl font-bold tracking-tight font-headline">
                    MathMind
                    </h1>
                </Link>
            </SidebarHeader>
            <SidebarContent>
              <MainNav />
            </SidebarContent>
            <SidebarFooter>
                <Button variant="ghost">
                    <LogOut />
                    <span>Log Out</span>
                </Button>
            </SidebarFooter>
          </div>
        </Sidebar>
        <SidebarInset>
          <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center">
              <SidebarTrigger className="md:hidden" />
              <div className="flex flex-1 items-center justify-end space-x-4">
                <ThemeToggle />
                <UserNav />
              </div>
            </div>
          </header>
          <main className="flex-1 p-4 md:p-8">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
