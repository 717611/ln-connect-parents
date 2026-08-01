import { createFileRoute } from "@tanstack/react-router";
import { Megaphone } from "lucide-react";
import { z } from "zod";

import { EmptyState } from "@/components/feedback/EmptyState";
import { ListSkeleton } from "@/components/feedback/skeletons";
import { AppShell } from "@/components/layout/AppShell";
import { NoticeCard } from "@/components/notices/NoticeCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LABELS } from "@/constants/labels";
import { useNotices } from "@/hooks/useNotices";
import { useStudentProfile } from "@/hooks/useStudentProfile";

const searchSchema = z.object({
  scope: z.enum(["school", "class"]).default("school"),
});

export const Route = createFileRoute("/notices")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Notices | LN Parent Portal" },
      {
        name: "description",
        content:
          "School-wide announcements and class notices — holidays, events, fees and academic updates in one feed.",
      },
      { property: "og:title", content: "Notices — LN Parent Portal" },
      {
        property: "og:description",
        content: "Announcements from LN International School, Ranchi, for parents.",
      },
    ],
  }),
  component: NoticesRoute,
});

function NoticesRoute() {
  const { scope } = Route.useSearch();
  const navigate = Route.useNavigate();
  const { student } = useStudentProfile();
  const classroomId = student?.classroomId ?? null;

  const schoolQuery = useNotices("school", null);
  const classQuery = useNotices("class", classroomId);

  const renderList = (isPending: boolean, notices: ReturnType<typeof useNotices>["data"]) => {
    if (isPending) return <ListSkeleton count={4} />;
    if (!notices || notices.length === 0) {
      return (
        <div className="surface-card">
          <EmptyState
            icon={Megaphone}
            title={LABELS.notices.emptyTitle}
            body={LABELS.notices.emptyBody}
          />
        </div>
      );
    }
    return (
      <div className="space-y-3">
        {notices.map((notice) => (
          <NoticeCard key={notice.id} notice={notice} />
        ))}
      </div>
    );
  };

  return (
    <AppShell title={LABELS.notices.title}>
      <Tabs
        value={scope}
        onValueChange={(value) =>
          void navigate({
            to: ".",
            search: { scope: value === "class" ? "class" : "school" },
            replace: true,
          })
        }
      >
        <TabsList className="grid w-full grid-cols-2 rounded-2xl bg-muted p-1">
          <TabsTrigger value="school" className="rounded-xl text-xs font-semibold">
            {LABELS.notices.school}
          </TabsTrigger>
          <TabsTrigger value="class" className="rounded-xl text-xs font-semibold">
            {LABELS.notices.class}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="school" className="mt-4">
          {renderList(schoolQuery.isPending, schoolQuery.data)}
        </TabsContent>
        <TabsContent value="class" className="mt-4">
          {renderList(classQuery.isPending, classQuery.data)}
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}
