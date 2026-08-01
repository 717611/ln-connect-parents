import {
  BookOpenCheck,
  Bus,
  CalendarDays,
  CreditCard,
  HeartHandshake,
  Lock,
  Scale,
  ShieldCheck,
  Shirt,
  ThumbsUp,
  PhoneCall,
  HelpCircle,
  type LucideIcon,
} from "lucide-react";

/**
 * In-app policy and quick-link content.
 * No PDFs, no external files — everything renders inside a modal.
 * Swap this module for Firestore documents later without touching components.
 */

export interface HelpDoc {
  id: string;
  title: string;
  summary: string;
  bullets: readonly string[];
  icon: LucideIcon;
  tone: "primary" | "accent" | "success" | "secondary";
  lastUpdated?: string;
}

export const POLICY_DOCS: readonly HelpDoc[] = [
  {
    id: "anti-bullying",
    title: "Anti-Bullying Policy",
    summary: "Zero tolerance towards bullying of any kind.",
    icon: ShieldCheck,
    tone: "primary",
    lastUpdated: "10 July 2026",
    bullets: [
      "The school follows a zero tolerance approach to bullying, teasing or intimidation.",
      "Any unsafe behaviour should be reported to the school immediately — the same day if possible.",
      "Every report is handled confidentially and only shared with staff who need to act on it.",
      "Confirmed cases go through an appropriate disciplinary review with the parents involved.",
      "Counselling support is offered to both the affected child and the child at fault.",
    ],
  },
  {
    id: "code-of-conduct",
    title: "Code of Conduct",
    summary: "What respectful school behaviour looks like every day.",
    icon: Scale,
    tone: "secondary",
    lastUpdated: "10 July 2026",
    bullets: [
      "Respect: students speak politely with teachers, staff and classmates.",
      "Discipline: classroom rules, timings and assembly instructions are followed.",
      "Uniform: the prescribed uniform is worn neatly on all working days.",
      "Behaviour: fighting, abusive language and damage to belongings are not allowed.",
      "School property: furniture, books, labs and buses are used with care.",
      "Parent cooperation: parents support the school in reinforcing these values at home.",
    ],
  },
  {
    id: "fee-policy",
    title: "Fee Policy",
    summary: "Fee schedule, late fee and who to ask for help.",
    icon: CreditCard,
    tone: "success",
    lastUpdated: "1 July 2026",
    bullets: [
      "Fees are to be paid on or before the scheduled date announced for each term.",
      "A late fee may apply once the due date has passed.",
      "Receipts are issued for every payment — please keep them for your records.",
      "For any doubt about an amount or receipt, contact the Accounts Office.",
    ],
  },
  {
    id: "attendance-policy",
    title: "Attendance Policy",
    summary: "Regular attendance keeps learning on track.",
    icon: CalendarDays,
    tone: "accent",
    lastUpdated: "1 July 2026",
    bullets: [
      "Regular attendance is strongly encouraged for every student.",
      "Please inform the school on the first day of any absence.",
      "Repeated or long absence may require a written explanation from parents.",
      "Medical absence should be supported by a doctor's note where possible.",
    ],
  },
  {
    id: "homework-policy",
    title: "Homework & Academic Responsibility",
    summary: "How homework should be supported at home.",
    icon: BookOpenCheck,
    tone: "primary",
    lastUpdated: "1 July 2026",
    bullets: [
      "Homework is given to reinforce what was taught in class.",
      "Parents should guide and encourage — not complete the work for the child.",
      "A quiet study time at home helps the child build consistency.",
      "Repeated missing homework may trigger a communication from the class teacher.",
    ],
  },
  {
    id: "transport-policy",
    title: "Transport Policy",
    summary: "Safety rules for school bus travel.",
    icon: Bus,
    tone: "accent",
    lastUpdated: "5 July 2026",
    bullets: [
      "Student safety comes first on every route, at every stop.",
      "Any route, stop or timing change must be requested through the school office.",
      "Students remain seated, follow the attendant's instructions and board only at their stop.",
      "Please reach the stop five minutes before the scheduled pick-up time.",
    ],
  },
  {
    id: "dress-code",
    title: "Dress Code Policy",
    summary: "Uniform and grooming expectations.",
    icon: Shirt,
    tone: "secondary",
    lastUpdated: "1 July 2026",
    bullets: [
      "The prescribed school uniform is worn on all regular working days.",
      "A neat appearance is expected — tidy hair, clean shoes and school ID.",
      "Sports uniform is worn only on the days communicated by the school.",
      "Instructions for special events and celebrations are shared separately.",
    ],
  },
  {
    id: "data-privacy",
    title: "Data Privacy Policy",
    summary: "How student and parent information is protected.",
    icon: Lock,
    tone: "success",
    lastUpdated: "12 July 2026",
    bullets: [
      "The school protects student and family information with care.",
      "Portal credentials are personal and should not be shared with anyone.",
      "Only authorised school staff can access student records.",
      "Information is never sold or shared with outside parties for marketing.",
    ],
  },
] as const;

export const QUICK_LINK_DOCS: readonly HelpDoc[] = [
  {
    id: "wellbeing",
    title: "Student Wellbeing",
    summary: "Emotional and health support for your child.",
    icon: HeartHandshake,
    tone: "primary",
    bullets: [
      "A trained counsellor is available during school hours for students who need to talk.",
      "Parents can request a private counselling session through the Help Desk.",
      "Health or allergy information should be shared with the school office in writing.",
      "Any concern about your child's mood, sleep or confidence can be raised confidentially.",
    ],
  },
  {
    id: "suggestions",
    title: "Suggestions & Appreciation",
    summary: "Share an idea or appreciate a teacher.",
    icon: ThumbsUp,
    tone: "success",
    bullets: [
      "Suggestions about academics, events or facilities are always welcome.",
      "Appreciation notes are shared with the teacher or staff member concerned.",
      "Raise a new request and choose the Administration category to send it.",
      "The management reviews parent suggestions at the monthly staff meeting.",
    ],
  },
  {
    id: "calendar",
    title: "School Calendar",
    summary: "Key dates for the current term.",
    icon: CalendarDays,
    tone: "accent",
    bullets: [
      "Term 2 begins on 15 August 2026.",
      "Parent–Teacher Meeting: first Saturday of every month, 9:00 AM – 12:00 PM.",
      "Half-yearly examinations: 20 – 30 September 2026.",
      "Annual Day: 12 December 2026.",
      "Detailed monthly plans are published under Notices.",
    ],
  },
  {
    id: "emergency",
    title: "Emergency Contacts",
    summary: "Numbers to use when something is urgent.",
    icon: PhoneCall,
    tone: "secondary",
    bullets: [
      "School Emergency Helpline: +91 90000 00911 (7:00 AM – 7:00 PM, all working days).",
      "Transport Emergency Desk: +91 90000 00002.",
      "School Office: +91 90000 00000.",
      "For a medical emergency during school hours the school calls the parent first, then the nearest hospital.",
    ],
  },
  {
    id: "policy-vault-link",
    title: "Policy Vault",
    summary: "All school policies in simple language.",
    icon: ShieldCheck,
    tone: "primary",
    bullets: [
      "Anti-Bullying, Code of Conduct and Dress Code.",
      "Fee, Attendance and Homework responsibilities.",
      "Transport safety rules.",
      "Data privacy commitments.",
      "Scroll down to the Policy Vault section to read any policy in full.",
    ],
  },
  {
    id: "faq-link",
    title: "FAQ",
    summary: "Quick answers to the most common questions.",
    icon: HelpCircle,
    tone: "accent",
    bullets: [
      "How quickly does the school respond to a request?",
      "How do I track a request I have already raised?",
      "Can I update or add details to my complaint?",
      "Who at the school can read my messages?",
      "Open the Common Questions section below for the full answers.",
    ],
  },
] as const;
