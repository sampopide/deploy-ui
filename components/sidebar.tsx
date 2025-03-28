"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Cloud,
  MonitorSmartphone,
  Rocket,
  Settings,
  LogOut,
  Power,
  List,
  CheckCircle2,
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const sidebarItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  {
    name: 'Cloudflare',
    icon: Cloud,
    subItems: [
      { name: 'Active Accounts', href: '/cloudflare', icon: CheckCircle2 },
      { name: 'Passive Accounts', href: '/cloudflare/passive', icon: Power },
      { name: 'Cloudflare List', href: '/cloudflare/list', icon: List },
    ],
  },
  { name: 'Landings', href: '/landings', icon: MonitorSmartphone },
  { name: 'Deploy', href: '/deploy', icon: Rocket },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  const renderMenuItem = (item: any) => {
    const Icon = item.icon;
    const isActive = pathname === item.href;

    if (item.subItems) {
      return (
        <Accordion type="single" collapsible className="w-full border-none">
          <AccordionItem value={item.name} className="border-none">
            <AccordionTrigger className="py-2 px-4 hover:no-underline">
              <div className="flex items-center">
                <Icon className="w-5 h-5 mr-3" />
                <span>{item.name}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col space-y-1">
                {item.subItems.map((subItem: any) => {
                  const SubIcon = subItem.icon;
                  const isSubActive = pathname === subItem.href;
                  
                  return (
                    <Link
                      key={subItem.name}
                      href={subItem.href}
                      className={cn(
                        "flex items-center py-2 px-4 text-sm rounded-lg transition-colors",
                        isSubActive
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      )}
                    >
                      <SubIcon className="w-4 h-4 min-w-[16px] mr-3" />
                      <span className="truncate">{subItem.name}</span>
                    </Link>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      );
    }

    return (
      <Link
        href={item.href}
        className={cn(
          "flex items-center px-4 py-3 text-sm rounded-lg transition-colors",
          isActive
            ? "bg-primary text-primary-foreground"
            : "hover:bg-muted"
        )}
      >
        <Icon className="w-5 h-5 mr-3" />
        {item.name}
      </Link>
    );
  };

  return (
    <div className="flex flex-col w-64 bg-card border-r">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-primary">Automation</h1>
      </div>
      
      <nav className="flex-1 px-4 space-y-1">
        {sidebarItems.map((item) => (
          <div key={item.name}>
            {renderMenuItem(item)}
          </div>
        ))}
      </nav>

      <div className="p-4 mt-auto border-t">
        <button className="flex items-center px-4 py-3 text-sm w-full rounded-lg text-destructive hover:bg-muted transition-colors">
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
}