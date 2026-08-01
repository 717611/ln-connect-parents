# LN Parent Portal — Build Plan

A premium, mobile-first Parent Portal for LN International School, Ranchi. UI-complete, no backend implementation, structured so Firebase can be plugged in later without touching the UI.

## Two notes before building

1. **Routing**: this project is fixed to TanStack Router (React Router cannot be installed here). Same SPA behaviour, file-based routes, typed navigation — no impact on UI or architecture.
2. **Framer Motion** ships as its successor package `motion` (same API, `motion/react`). Will be added along with `@fontsource` Poppins/Inter.

## Brand & design system

Tokens added to `src/styles.css` (oklch, semantic):
- Primary `#FFB000`, Secondary `#1C2340`, Accent `#5B7CFA`, Success `#22C55E`, Warning `#F59E0B`, Danger `#EF4444`, Background `#F8FAFC`, Card white
- Radius base 22px (cards 20–24px), soft layered shadows, Poppins headings / Inter body
- Light theme only. No hardcoded colour classes anywhere.

Feel: generous white space, rounded white cards, restrained motion (fade / slide / scale, 150–250ms).

## Screens

| Route | Content |
|---|---|
| `/` (login) | School-building hero image, blur + dark gradient, logo, "LN International School" / "Parents Portal" / tagline, Admission Number + Password (React Hook Form + Zod), Forgot Password, primary button. No social login. |
| `/home` | Greeting + parent/student/class/section + avatar; large attendance hero card; Quick Access (Homework, Classwork, Gallery, Complaint); today's academic timeline; recent school + class notices; complaint status card; gallery preview (4 latest) |
| `/work` | Homework / Classwork tabs (URL search param), academic cards with teacher, subject, description, due date, status badge |
| `/notices` | School / Class notice tabs, priority badges, icons, dates, detail read view |
| `/attendance` | Premium "Coming Soon" empty state with illustration |
| `/gallery` | Responsive masonry grid, albums filter, fullscreen preview (no download) |
| `/complaints` | Support-center list with ticket IDs + status badges (Open / In Progress / Resolved / Closed), new complaint form |
| `/complaints/$id` | Private conversation thread + message composer (UI only) |
| `/profile` | Student photo, name, admission no., class, section, parent name, mobile; Change Password, Contact School, Privacy Policy, About, Logout |

Bottom navigation: Home, Work, Notices, Profile (4 tabs only). Complaint Portal is a featured Home card. Desktop gets a widened centred layout with the same nav pattern.

## Architecture

```text
src/
  components/
    layout/      AppShell, BottomNav, PageHeader
    ui/          existing shadcn primitives
    common/      SectionHeading, StatusBadge, EmptyState, Avatar, Card variants
    home/ work/ notices/ gallery/ complaints/ profile/
  services/      authService, studentService, homeworkService, classworkService,
                 noticeService, galleryService, complaintService, attendanceService
  lib/firebase.ts   isolated config with TODO placeholders (no SDK calls)
  types/         domain interfaces (Student, Parent, Notice, WorkItem, Complaint, ...)
  data/mockData.ts  single source of all placeholder data
  hooks/         useAuth, useStudent, and TanStack Query hooks per service
```

- Every service exports typed async placeholder methods that currently read from `mockData.ts` and are marked with `// TODO: replace with Firestore query`. Signatures are the final Firebase-facing ones, so swapping the body is the only change needed.
- Components never import `mockData` directly — they consume TanStack Query hooks over the services.
- `firebase.ts` holds config placeholders and typed `getAuth/getFirestore/getStorage/getMessaging` accessors left unimplemented; no fake backend, no mock API layer.
- Auth is a client-side context guard reading a demo session so protected routes behave correctly; it delegates to `authService` for the real call later.

## Images

Generated assets under `src/assets/`: school-building login backdrop, LN crest logo, attendance coming-soon illustration, gallery/student placeholder photos. No literal reuse of the inspiration board.

## Out of scope

Attendance logic, real authentication, Firebase implementation, admin/teacher features, downloads in gallery, push notification wiring (FCM left as a service stub).
