import { createFileRoute } from "@tanstack/react-router";
import { ClipboardList } from "lucide-react";
import { z } from "zod";

import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorState } from "@/components/feedback/ErrorState";
import { ListSkeleton } from "@/components/feedback/skeletons";
import { AppShell } from "@/components/layout/AppShell";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClassworkCard } from "@/components/work/ClassworkCard";
import { HomeworkCard } from "@/components/work/HomeworkCard";
import { LABELS } from "@/constants/labels";
import { useClasswork, useHomework } from "@/hooks/useAcademicWork";
import { useStudentProfile } from "@/hooks/useStudentProfile";

const searchSchema = z.object({
  tab: z.enum(["homework", "classwork"]).default("homework"),
});

export const Route = createFileRoute("/work")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Academic Work | LN Parent Portal" },
      {
        name: "description",
        content:
          "Track homework due dates and classwork covered in school, subject by subject, in one place.",
      },
      { property: "og:title", content: "Academic Work — LN Parent Portal" },
      {
        property: "og:description",
        content: "Homework and classwork updates shared by teachers at LN International School.",
      },
    ],
  }),
  component: WorkRoute,
});

function WorkRoute() {
  const { tab } = Route.useSearch();
  const navigate = Route.useNavigate();
  const { student, isLoading, isError, refetch } = useStudentProfile();
  const classroomId = student?.classroomId ?? null;
  const className = student?.className ?? null;

  const homeworkQuery = useHomework(classroomId, className);
  const classworkQuery = useClasswork(classroomId, className);

  const homework = homeworkQuery.data ?? [];
  const classwork = classworkQuery.data ?? [];

  return (
    <AppShell title={LABELS.work.title}>
      {isError ? (
        <div className="surface-card">
          <ErrorState onRetry={refetch} />
        </div>
      ) : (
        <Tabs
          value={tab}
          onValueChange={(value) =>
            void navigate({
              to: ".",
              search: { tab: value === "classwork" ? "classwork" : "homework" },
              replace: true,
            })
          }
        >
          <TabsList className="grid w-full grid-cols-2 rounded-2xl bg-muted p-1">
            <TabsTrigger value="homework" className="rounded-xl text-xs font-semibold">
              {LABELS.work.homework}
            </TabsTrigger>
            <TabsTrigger value="classwork" className="rounded-xl text-xs font-semibold">
              {LABELS.work.classwork}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="homework" className="mt-4">
            {isLoading || homeworkQuery.isPending ? (
              <ListSkeleton count={4} />
            ) : homework.length === 0 ? (
              <div className="surface-card">
                <EmptyState
                  icon={ClipboardList}
                  title={LABELS.work.emptyTitle}
                  body={LABELS.work.emptyBody}
                />
              </div>
            ) : (
              <div className="space-y-3">
                {homework.map((item) => (
                  <HomeworkCard key={item.id} homework={item} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="classwork" className="mt-4">
            {isLoading || classworkQuery.isPending ? (
              <ListSkeleton count={4} />
            ) : classwork.length === 0 ? (
              <div className="surface-card">
                <EmptyState
                  icon={ClipboardList}
                  title={LABELS.work.emptyTitle}
                  body={LABELS.work.emptyBody}
                />
              </div>
            ) : (
              <div className="space-y-3">
                {classwork.map((item) => (
                  <ClassworkCard key={item.id} classwork={item} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </AppShell>
  );
}
