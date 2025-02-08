"use client";
import { useState } from "react";
import Link from "next/link";
import {
  Package,
  Users,
  Settings,
  LayoutDashboard,
  ChevronDown,
  Bandage,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const DashboardSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
    { icon: Package, label: "Movies", href: "/dashboard/movies" },
  ];

  return (
    <div
      className={`bg-card border-r h-screen fixed left-0 ${
        collapsed ? "w-16" : "w-64"
      } transition-all duration-300`}
    >
      <div className="p-4 border-b flex justify-between items-center">
        {!collapsed && <span className="font-bold">Dashboard</span>}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
        >
          <ChevronDown
            className={`w-5 h-5 transition-transform ${
              collapsed ? "-rotate-90" : ""
            }`}
          />
        </Button>
      </div>

      <nav className="p-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center space-x-2 p-2 rounded-lg hover:bg-background ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <item.icon className="w-5 h-5" />
            {!collapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default DashboardSidebar;
