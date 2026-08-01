import {
  BookOpen,
  Bell,
  Headset,
  CalendarCheck,
  House,
  Images,
  LifeBuoy,
  NotebookPen,
  User,
  type LucideIcon,
} from "lucide-react";

import { ROUTES } from "./routes";

export interface NavItem {
  id: string;
  label: string;
  to: string;
  icon: LucideIcon;
  exact?: boolean;
}

/** Bottom navigation. The Home complaint card remains a quick CTA into the Help Desk. */
export const BOTTOM_NAV_ITEMS: readonly NavItem[] = [
  { id: "home", label: "Home", to: ROUTES.home, icon: House, exact: true },
  { id: "work", label: "Work", to: ROUTES.work, icon: BookOpen },
  { id: "helpdesk", label: "Help Desk", to: ROUTES.helpDesk, icon: Headset },
  { id: "notices", label: "Notices", to: ROUTES.notices, icon: Bell },
  { id: "profile", label: "Profile", to: ROUTES.profile, icon: User },
] as const;

export interface QuickAccessItem {
  id: string;
  label: string;
  to: string;
  icon: LucideIcon;
  tone: "primary" | "accent" | "success" | "secondary";
  search?: Record<string, string>;
}

export const QUICK_ACCESS_ITEMS: readonly QuickAccessItem[] = [
  {
    id: "homework",
    label: "Homework",
    to: ROUTES.work,
    icon: NotebookPen,
    tone: "primary",
    search: { tab: "homework" },
  },
  {
    id: "classwork",
    label: "Classwork",
    to: ROUTES.work,
    icon: BookOpen,
    tone: "accent",
    search: { tab: "classwork" },
  },
  { id: "gallery", label: "Gallery", to: ROUTES.gallery, icon: Images, tone: "success" },
  { id: "attendance", label: "Attendance", to: ROUTES.attendance, icon: CalendarCheck, tone: "secondary" },
] as const;

export const COMPLAINT_FEATURE_NAV = {
  label: "Complaint Portal",
  to: ROUTES.complaints,
  icon: LifeBuoy,
} as const;
