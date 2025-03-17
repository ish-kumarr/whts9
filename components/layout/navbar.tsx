"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Cloud,
  Search,
  ListTodo,
  AlertCircle,
  MessageSquare,
  Bell,
  LogOut,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [unreadMessages, setUnreadMessages] = useState(5);
  const [urgentTasks, setUrgentTasks] = useState(3);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove("auth-token");
    router.push("/login");
  };

  const navItems = [
    {
      label: "Tasks",
      href: "/tasks",
      icon: ListTodo,
      color: "text-blue-500",
    },
    {
      label: "Priority",
      href: "/priority",
      icon: AlertCircle,
      color: "text-red-500",
      badge: urgentTasks,
    },
    {
      label: "Messages",
      href: "/messages",
      icon: MessageSquare,
      color: "text-emerald-500",
      badge: unreadMessages,
    },
  ];

  return (
    <div className="border-b border-white/10 bg-black/40 backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="flex items-center gap-2">
              <Cloud className="h-6 w-6 text-[#4C9EEB]" />
              <span className="text-xl font-semibold text-white">WhatsAssist</span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant="ghost"
                      className={cn(
                        "relative h-9 rounded-full px-4",
                        isActive
                          ? "bg-white/10 text-white"
                          : "text-white/60 hover:text-white hover:bg-white/10"
                      )}
                    >
                      <item.icon className={cn("h-4 w-4 mr-2", item.color)} />
                      {item.label}
                      {item.badge && (
                        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 flex items-center justify-center text-xs font-medium text-white">
                          {item.badge}
                        </span>
                      )}
                    </Button>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:block w-72">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
              <Input
                placeholder="Search..."
                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40 h-9 rounded-full focus:ring-1 focus:ring-[#4C9EEB] focus:border-[#4C9EEB]"
              />
            </div>

            <div className="flex items-center gap-2">
              <p className="text-sm text-white/60">
                Welcome back, <span className="text-white font-medium">Ish</span>
              </p>
              <Button
                variant="ghost"
                size="icon"
                className="text-white/60 hover:text-red-500"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}