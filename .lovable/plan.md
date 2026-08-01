# LN Parent Portal — Build Plan

A premium, mobile-first Parent Portal for LN International School, Ranchi. UI-complete, no backend implementation, layered so Firebase becomes a single swap at the repository level.

## Two notes before building

1. **Routing**: this project is fixed to TanStack Router (React Router cannot be installed here). Same SPA behaviour, file-based routes, typed navigation, route guards — no impact on UI or architecture.
2. **Framer Motion** ships as its successor package `motion` (identical API via `motion/react`). Added along with `@fontsource` Poppins/Inter.

## Layered architecture (enforced)

```text
Component → TanStack Query hook → Service → Repository → mockData
                                                      ↓ later
                                                   Firestore
```

Components never import `mockData`. Only repository bodies change when Firebase arrives.

```text
src/
  models/        Student, Parent, Teacher, Homework, Classwork, Notice,
                 Complaint, Attendance, Gallery, Subject, Classroom
  repositories/  AuthRepository, StudentRepository, HomeworkRepository,
                 ClassworkRepository, NoticeRepository, ComplaintRepository,
                 GalleryRepository, AttendanceRepository
  services/      authService, studentService, homeworkService, classworkService,
                 noticeService, galleryService, complaintService, attendanceService
  hooks/         useAuth + one query/mutation hook per domain
  config/firebase.ts   placeholder config, TODOs, exported accessors, no SDK calls
  constants/     routes.ts, navigation.ts, labels.ts, theme.ts, config.ts
  components/
    layout/      AppShell, AppHeader, BottomNav, PageContainer
    guards/      ProtectedRoute, PublicRoute, RoleGuard
    feedback/    ErrorBoundary, OfflineState, EmptyState, skeletons/
    common/      StatusBadge, PriorityBadge, SectionHeading, Avatar, StatCard
    home/ work/ notices/ gallery/ complaints/ profile/ attendance/
  data/mockData.ts   single placeholder-data source, consumed only by repositories
  assets/        login-school.jpg, student-placeholder.jpg,
                 gallery-placeholder.jpg, attendance-placeholder.svg, ln-logo.svg
```

- Models are the canonical entities and are written to match the existing SchoolOS Firestore contract — no invented collections, no altered shapes.
- Repositories return typed mock data today with `// TODO: replace with Firestore query` at each call site.
- All routes, labels, nav items, and theme values come from `src/constants/*` — nothing hardcoded, localization-ready.

## Design system

Tokens in `src/styles.css` (oklch, semantic, light theme only): Primary `#FFB000`, Secondary `#1C2340`, Accent `#5B7CFA`, Success `#22C55E`, Warning `#F59E0B`, Danger `#EF4444`, Background `#F8FAFC`, white cards, radius 20–24px, soft layered shadows, Poppins headings / Inter body. No hardcoded colour classes, no inline styles.

Feel: Apple restraint + Material 3 structure + Notion cleanliness, generous white space, subtle 150–250ms fade/slide/scale motion.

## Screens

| Route | Content |
|---|---|
| `/` login (PublicRoute) | School-building backdrop, blur + dark gradient, logo, "LN International School" / "Parents Portal" / tagline, Admission Number + Password (React Hook Form + Zod), Forgot Password, primary button. No social login. |
| `/home` | Header with greeting, parent/student/class/section, avatar, **notification bell (UI only)**; attendance hero card; Quick Access (Homework, Classwork, Gallery, Complaint); today's academic timeline; recent school + class notices; complaint status card; gallery preview (4 latest) |
| `/work` | Homework / Classwork tabs (URL search param); cards with teacher, subject, description, due date, status badge |
| `/notices` | School / Class tabs, priority badges, icons, dates, detail read view |
| `/attendance` | **Final dashboard layout** — monthly summary tiles, calendar grid frame, subject-wise section — all rendered as a premium empty state so `attendanceService` connects later without redesign |
| `/gallery` | Album filters, responsive masonry grid, fullscreen preview, no download |
| `/complaints` | Support-center list: ticket IDs, status badges (Open / In Progress / Resolved / Closed), new-complaint form |
| `/complaints/$id` | Private conversation thread + message composer (UI only) |
| `/profile` | Student photo, name, admission no., class, section, parent name, mobile; Change Password, Contact School, Privacy Policy, About, Logout |

Bottom nav: Home, Academic Work, Notices, Profile. Complaint Portal is a featured Home card, not a tab. Every authenticated page renders inside `AppShell` (header + page + bottom nav) — no duplicated navigation. Desktop widens to a centred column with the same shell.

## Resilience & feedback

- **Guards**: `ProtectedRoute` / `PublicRoute` / `RoleGuard` backed by a demo session in auth context, wired through the router's `_authenticated` layout so switching to Firebase Auth touches only `AuthRepository`.
- **Errors**: React Error Boundary around the shell, friendly route-level error components, global Not Found page. No default React crash screen.
- **Loading**: reusable skeletons for card, list, profile, timeline, gallery, complaint thread. No "Loading…" text.
- **Offline**: reusable `OfflineState` (message, retry, illustration) driven by an online/offline hook.

## Images

Neutral placeholder assets with the exact filenames above, referenced through a small asset map so real school photography can be dropped in without touching components.

## Out of scope

Attendance logic, real authentication, Firebase SDK code, admin/teacher features, gallery downloads, FCM wiring (left as a service stub).
