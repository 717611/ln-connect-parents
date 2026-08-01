import {
  Bus,
  Building2,
  ClipboardList,
  CreditCard,
  GraduationCap,
  HeartHandshake,
  Mail,
  MessageSquarePlus,
  Phone,
  ShieldAlert,
  Users,
  type LucideIcon,
} from "lucide-react";

import type { ComplaintCategory } from "@/models";

/**
 * Static Help Desk presentation content.
 * Lightweight and easy to swap for Firestore-backed documents later.
 */

export interface SupportCategory {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
  tone: "primary" | "accent" | "success" | "secondary";
  category: ComplaintCategory;
}

export const SUPPORT_CATEGORIES: readonly SupportCategory[] = [
  {
    id: "academics",
    label: "Academics",
    description: "Homework, marks, teachers",
    icon: GraduationCap,
    tone: "primary",
    category: "academics",
  },
  {
    id: "behaviour",
    label: "Behaviour",
    description: "Discipline or bullying",
    icon: ShieldAlert,
    tone: "secondary",
    category: "discipline",
  },
  {
    id: "transport",
    label: "Transport",
    description: "Bus timing or route",
    icon: Bus,
    tone: "accent",
    category: "transport",
  },
  {
    id: "fees",
    label: "Fees",
    description: "Payments and receipts",
    icon: CreditCard,
    tone: "success",
    category: "fees",
  },
  {
    id: "infrastructure",
    label: "Infrastructure",
    description: "Classroom, water, hygiene",
    icon: Building2,
    tone: "accent",
    category: "infrastructure",
  },
  {
    id: "wellbeing",
    label: "Student Wellbeing",
    description: "Health and counselling",
    icon: HeartHandshake,
    tone: "primary",
    category: "wellbeing",
  },
  {
    id: "administration",
    label: "Administration",
    description: "Records, ID, certificates",
    icon: ClipboardList,
    tone: "secondary",
    category: "administration",
  },
  {
    id: "other",
    label: "Other",
    description: "Any other concern",
    icon: MessageSquarePlus,
    tone: "success",
    category: "other",
  },
] as const;

export interface SchoolContact {
  id: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  hours: string;
  icon: LucideIcon;
}

export const SCHOOL_CONTACTS: readonly SchoolContact[] = [
  {
    id: "office",
    name: "School Office",
    role: "General queries & admissions",
    phone: "+91 90000 00000",
    email: "office@lnisranchi.in",
    hours: "Mon–Sat · 8:00 AM – 3:00 PM",
    icon: Building2,
  },
  {
    id: "coordinator",
    name: "Academic Coordinator",
    role: "Homework, exams & teachers",
    phone: "+91 90000 00001",
    email: "academics@lnisranchi.in",
    hours: "Mon–Fri · 9:00 AM – 2:00 PM",
    icon: GraduationCap,
  },
  {
    id: "transport",
    name: "Transport Desk",
    role: "Bus routes & pick-up timings",
    phone: "+91 90000 00002",
    email: "transport@lnisranchi.in",
    hours: "Mon–Sat · 7:00 AM – 5:00 PM",
    icon: Bus,
  },
  {
    id: "accounts",
    name: "Accounts Office",
    role: "Fees, receipts & refunds",
    phone: "+91 90000 00003",
    email: "accounts@lnisranchi.in",
    hours: "Mon–Sat · 9:00 AM – 2:00 PM",
    icon: CreditCard,
  },
  {
    id: "principal",
    name: "Principal Office",
    role: "Escalations & appointments",
    phone: "+91 90000 00004",
    email: "principal@lnisranchi.in",
    hours: "Mon–Fri · 11:00 AM – 1:00 PM",
    icon: Users,
  },
] as const;

export const CONTACT_ICONS = { phone: Phone, email: Mail } as const;

export interface EmergencyContactInfo {
  name: string;
  description: string;
  phone: string;
  hours: string;
}

export const EMERGENCY_CONTACT: EmergencyContactInfo = {
  name: "School Emergency Helpline",
  description:
    "For urgent safety, medical or transport situations involving your child, call this number right away.",
  phone: "+91 90000 00911",
  hours: "All working days · 7:00 AM – 7:00 PM",
};

export interface HelpDeskFaq {
  id: string;
  question: string;
  answer: string;
}

export const HELP_DESK_FAQS: readonly HelpDeskFaq[] = [
  {
    id: "response-time",
    question: "How quickly does the school respond?",
    answer:
      "Most requests receive a first reply within one working day. Urgent transport, safety or medical concerns are looked at the same day.",
  },
  {
    id: "track",
    question: "How do I track my request?",
    answer:
      "Every request gets a ticket number. Open it from My Requests to read replies from the school and continue the conversation.",
  },
  {
    id: "update",
    question: "Can I update my complaint?",
    answer:
      "Yes. Open the request and send another message in the same thread — new details are added to the existing ticket instead of a new one.",
  },
  {
    id: "private",
    question: "Who can read my messages?",
    answer:
      "Only the school staff handling your request. Each conversation is private between you and the school office, and no other parent can see it.",
  },
] as const;
