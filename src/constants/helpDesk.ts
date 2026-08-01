import { Bus, CreditCard, GraduationCap, Mail, MessageSquarePlus, Phone, type LucideIcon } from "lucide-react";

import type { ComplaintCategory } from "@/models";

/**
 * Static Help Desk presentation content.
 * Lightweight and easy to swap for Firestore-backed documents later.
 */

export interface HelpDeskQuickAction {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
  tone: "primary" | "accent" | "success" | "secondary";
  category: ComplaintCategory;
}

export const HELP_DESK_QUICK_ACTIONS: readonly HelpDeskQuickAction[] = [
  {
    id: "academics",
    label: "Academics",
    description: "Homework, marks, teachers",
    icon: GraduationCap,
    tone: "primary",
    category: "academics",
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
    id: "other",
    label: "Something else",
    description: "Any other concern",
    icon: MessageSquarePlus,
    tone: "secondary",
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
}

export const SCHOOL_CONTACTS: readonly SchoolContact[] = [
  {
    id: "office",
    name: "School Office",
    role: "General queries & admissions",
    phone: "+91 90000 00000",
    email: "office@lnisranchi.in",
    hours: "Mon–Sat · 8:00 AM – 3:00 PM",
  },
  {
    id: "coordinator",
    name: "Academic Coordinator",
    role: "Homework, exams & teachers",
    phone: "+91 90000 00001",
    email: "academics@lnisranchi.in",
    hours: "Mon–Fri · 9:00 AM – 2:00 PM",
  },
  {
    id: "transport",
    name: "Transport Desk",
    role: "Bus routes & pick-up timings",
    phone: "+91 90000 00002",
    email: "transport@lnisranchi.in",
    hours: "Mon–Sat · 7:00 AM – 5:00 PM",
  },
] as const;

export const CONTACT_ICONS = { phone: Phone, email: Mail } as const;

export interface HelpDeskFaq {
  id: string;
  question: string;
  answer: string;
}

export const HELP_DESK_FAQS: readonly HelpDeskFaq[] = [
  {
    id: "response-time",
    question: "How quickly will the school respond?",
    answer:
      "Most requests receive a first reply within one working day. Urgent transport or safety concerns are looked at the same day.",
  },
  {
    id: "track",
    question: "How do I track my request?",
    answer:
      "Every request gets a ticket number. Open it from My Requests to read replies from the school and continue the conversation.",
  },
  {
    id: "private",
    question: "Can other parents see my request?",
    answer:
      "No. Each conversation is private between you and the school office. Nothing you write is visible to other parents.",
  },
  {
    id: "call",
    question: "Can I speak to someone directly?",
    answer:
      "Yes. Use School Contacts above to call the right desk during working hours, or reply in your request thread any time.",
  },
] as const;
