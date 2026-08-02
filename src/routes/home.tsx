import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarDays, ClipboardList, Megaphone } from "lucide-react";

import { SectionCard } from "@/components/common/SectionCard";
import { SectionHeading } from "@/components/common/SectionHeading";
import { StudentAvatar } from "@/components/common/StudentAvatar";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorState } from "@/components/feedback/ErrorState";
import { CardSkeleton, ListSkeleton } from "@/components/feedback/skeletons";
import { AttendancePreviewCard } from "@/components/home/AttendancePreviewCard";
import { ComplaintCallout } from "@/components/home/ComplaintCallout";
import { QuickAccessGrid } from "@/components/home/QuickAccessGrid";
import { AppShell } from "@/components/layout/AppShell";
import { NoticeCard } from "@/components/notices/NoticeCard";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { HomeworkCard } from "@/components/work/HomeworkCard";
import { LABELS } from "@/constants/labels";
import { ROUTES } from "@/constants/routes";
import { useComplaints } from "@/hooks/useComplaints";
import { useHomework } from "@/hooks/useAcademicWork";
import { useLatestGalleryPhotos } from "@/hooks/useGallery";
import { useNotices } from "@/hooks/useNotices";
import { useStudentProfile } from "@/hooks/useStudentProfile";
import { formatClassSection } from "@/models";
import { greeting } from "@/lib/format";

export const Route = createFileRoute("/home")({
  head: () => ({
    meta: [
      { title: "Home | LN Parent Portal" },
      {
        name: "description",
        content:
          "Your daily snapshot: homework, classwork, school notices, gallery highlights and complaint updates for your child.",
      },
      { property: "og:title", content: "LN Parent Portal — Home" },
      {
        property: "og:description",
        content: "Daily academic updates for parents of LN International School, Ranchi.",
      },
    ],
  }),
  component: HomeRoute,
});

function HomeRoute() {
  const { student, parent, isLoading, isError, refetch } = useStudentProfile();

  const header = (
    <div className="flex items-center gap-3">
      <StudentAvatar name={student?.fullName || "Student"} photoUrl={student?.photoUrl} />
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">
          {greeting()}
          {parent?.fullName ? `, ${(parent.fullName || "").split(" ")[0]}` : ""}
        </p>
        <p className="truncate font-display text-base font-semibold text-foreground">
          {(student?.fullName || "").split(" ").slice(0, 3).join(" ") || "Loading…"}
        </p>
        <p className="truncate text-[11px] text-muted-foreground">
          {student ? `${formatClassSection(student)} · Roll ${student.rollNumber || "—"}` : ""}
        </p>
      </div>
    </div>
  );

  return (
    <AppShell header={header} showNotifications>
      {isError ? (
        <SectionCard>
          <ErrorState onRetry={refetch} />
        </SectionCard>
      ) : isLoading || !student ? (
        <div className="space-y-4">
          <CardSkeleton />
          <ListSkeleton count={2} />
        </div>
      ) : (
        <HomeContent classroomId={student.classroomId} studentId={student.id} />
      )}
    </AppShell>
  );
}

function HomeContent({ classroomId, studentId }: { classroomId: string; studentId: string }) {
  const homeworkQuery = useHomework(classroomId);
  const schoolNoticesQuery = useNotices("school", null);
  const complaintsQuery = useComplaints(studentId);
  const photosQuery = useLatestGalleryPhotos(4);

  const upcomingHomework = (homeworkQuery.data ?? []).slice(0, 2);
  const notices = (schoolNoticesQuery.data ?? []).slice(0, 2);
  const activeComplaints = (complaintsQuery.data ?? []).filter(
    (item) => item.status === "open" || item.status === "in_progress",
  );

  return (
    <div className="space-y-6">
      <SectionCard delay={0.02}>
        <SectionHeading title={LABELS.home.quickAccess} />
        <QuickAccessGrid />
      </SectionCard>

      <AttendancePreviewCard delay={0.04} />

      <section>
        <SectionHeading
          title={LABELS.home.todaysUpdates}
          actionTo={ROUTES.work}
          actionSearch={{ tab: "homework" }}
        />
        {homeworkQuery.isPending ? (
          <ListSkeleton count={2} />
        ) : upcomingHomework.length === 0 ? (
          <div className="surface-card">
            <EmptyState
              icon={ClipboardList}
              title={LABELS.work.emptyTitle}
              body={LABELS.work.emptyBody}
            />
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingHomework.map((homework) => (
              <HomeworkCard key={homework.id} homework={homework} />
            ))}
          </div>
        )}
      </section>

      <section>
        <SectionHeading title={LABELS.home.schoolNotices} actionTo={ROUTES.notices} />
        {schoolNoticesQuery.isPending ? (
          <ListSkeleton count={2} />
        ) : notices.length === 0 ? (
          <div className="surface-card">
            <EmptyState
              icon={Megaphone}
              title={LABELS.notices.emptyTitle}
              body={LABELS.notices.emptyBody}
            />
          </div>
        ) : (
          <div className="space-y-3">
            {notices.map((notice) => (
              <NoticeCard key={notice.id} notice={notice} compact />
            ))}
          </div>
        )}
      </section>

      <ComplaintCallout activeCount={activeComplaints.length} delay={0.06} />

      <section>
        <SectionHeading title={LABELS.home.gallery} actionTo={ROUTES.gallery} />
        {photosQuery.isPending ? (
          <div className="grid grid-cols-2 gap-3">
            <CardSkeleton className="h-32" />
            <CardSkeleton className="h-32" />
          </div>
        ) : (photosQuery.data ?? []).length === 0 ? (
          <div className="surface-card">
            <EmptyState
              icon={CalendarDays}
              title={LABELS.gallery.emptyTitle}
              body={LABELS.gallery.emptyBody}
            />
          </div>
        ) : (
          <GalleryGrid photos={photosQuery.data ?? []} />
        )}
      </section>

      <Link
        to={ROUTES.profile}
        className="block text-center text-xs font-semibold text-accent transition-opacity hover:opacity-75"
      >
        View student profile
      </Link>
    </div>
  );
}
