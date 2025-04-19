
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  CircleDollarSign,
  CreditCard,
  Home,
  ReceiptText,
  User,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Bell,
  FileText,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { user, signOut } = useAuth();

  const isEmployer = user?.role === "employer";
  
  const navigationItems = [
    {
      label: "Dashboard",
      icon: Home,
      href: "/",
    },
    {
      label: "Jobs",
      icon: Calendar,
      href: "/jobs",
    },
    {
      label: isEmployer ? "Workers" : "Employers",
      icon: User,
      href: isEmployer ? "/workers" : "/employers",
    },
    {
      label: "Payments",
      icon: CircleDollarSign,
      href: "/payments",
    },
    {
      label: "Wallet",
      icon: CreditCard,
      href: "/wallet",
    },
    {
      label: "Reports",
      icon: FileText,
      href: "/reports",
    },
    {
      label: "Receipts",
      icon: ReceiptText,
      href: "/receipts",
    },
    {
      label: "Notifications",
      icon: Bell,
      href: "/notifications",
    },
    {
      label: "Profile",
      icon: User,
      href: "/profile",
    },
  ];

  return (
    <aside
      className={cn(
        "bg-sidebar h-screen transition-all flex flex-col border-r border-sidebar-border",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className={cn(
        "flex items-center p-3 border-b border-sidebar-border",
        collapsed ? "justify-center" : "justify-between"
      )}>
        {!collapsed && (
          <div className="font-bold text-xl text-gradient bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            WorkWise
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>

      <div className="flex items-center gap-3 p-3 border-b border-sidebar-border">
        <Avatar className={cn("h-10 w-10", collapsed ? "mx-auto" : "")}>
          <AvatarImage src={user?.avatar_url} />
          <AvatarFallback>{getInitials(user?.name || "")}</AvatarFallback>
        </Avatar>
        {!collapsed && (
          <div className="flex flex-col overflow-hidden">
            <span className="font-medium truncate">{user?.name}</span>
            <span className="text-xs text-sidebar-foreground/70 capitalize">{user?.role}</span>
          </div>
        )}
      </div>

      <nav className="flex-1 py-4 overflow-y-auto">
        <TooltipProvider delayDuration={0}>
          <ul className="space-y-1 px-2">
            {navigationItems.map((item) => (
              <li key={item.href}>
                {collapsed ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <NavLink
                        to={item.href}
                        className={({ isActive }) =>
                          cn(
                            "flex items-center justify-center p-2 rounded-md transition-colors",
                            isActive
                              ? "bg-sidebar-primary text-sidebar-primary-foreground"
                              : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                          )
                        }
                      >
                        <item.icon size={20} />
                      </NavLink>
                    </TooltipTrigger>
                    <TooltipContent side="right">{item.label}</TooltipContent>
                  </Tooltip>
                ) : (
                  <NavLink
                    to={item.href}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center px-3 py-2 rounded-md transition-colors",
                        isActive
                          ? "bg-sidebar-primary text-sidebar-primary-foreground"
                          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      )
                    }
                  >
                    <item.icon size={18} className="mr-3" />
                    <span>{item.label}</span>
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
        </TooltipProvider>
      </nav>

      <div className="p-3 border-t border-sidebar-border">
        {collapsed ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={signOut}
                className="w-full text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <LogOut size={18} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Sign Out</TooltipContent>
          </Tooltip>
        ) : (
          <Button
            variant="ghost"
            onClick={signOut}
            className="w-full text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <LogOut size={18} className="mr-2" /> Sign Out
          </Button>
        )}
      </div>
    </aside>
  );
}
