import {
  BarChart3,
  Bell,
  Building2,
  ClipboardList,
  LayoutDashboard,
  Shield,
  Wrench,
} from "lucide-react";
import type { AppRole } from "@/lib/ccms";

type NavItem = { to: string; label: string; icon: typeof Bell; roles?: AppRole[] };

const NAV: NavItem[] = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  {
    to: "/complaints",
    label: "My Complaints",
    icon: ClipboardList,
    roles: ["student", "faculty", "technician", "estate_manager", "admin"],
  },
  { to: "/technician", label: "My Jobs", icon: Wrench, roles: ["technician"] },
  { to: "/manager", label: "All Complaints", icon: Building2, roles: ["estate_manager", "admin"] },
  { to: "/reports", label: "Reports", icon: BarChart3, roles: ["estate_manager", "admin"] },
  { to: "/admin", label: "Administration", icon: Shield, roles: ["admin"] },
  { to: "/notifications", label: "Notifications", icon: Bell },
];

export function visibleNavigation(role?: AppRole) {
  return NAV.filter((item) => !item.roles || (role && item.roles.includes(role)));
}
