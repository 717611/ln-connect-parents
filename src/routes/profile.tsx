import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Info, KeyRound, LogOut, Phone, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { SectionCard } from "@/components/common/SectionCard";
import { StudentAvatar } from "@/components/common/StudentAvatar";
import { StatusBadge } from "@/components/common/StatusBadge";
import { ErrorState } from "@/components/feedback/ErrorState";
import { ProfileSkeleton } from "@/components/feedback/skeletons";
import { AppShell } from "@/components/layout/AppShell";
import { ProfileAction, ProfileField } from "@/components/profile/ProfileRows";
import { Separator } from "@/components/ui/separator";
import { APP_CONFIG } from "@/constants/config";
import { LABELS } from "@/constants/labels";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";
import { useStudentProfile } from "@/hooks/useStudentProfile";
import { formatClassSection } from "@/models";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile | LN Parent Portal" },
      {
        name: "description",
        content:
          "Student and parent details, school contact options and account settings for the LN Parent Portal.",
      },
      { property: "og:title", content: "Profile — LN Parent Portal" },
      {
        property: "og:description",
        content: "Manage your LN International School parent account.",
      },
    ],
  }),
  component: ProfileRoute,
});

function ProfileRoute() {
  const { student, parent, isLoading, isError, refetch } = useStudentProfile();
  const { logout, session } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const onLogout = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await logout();
    await navigate({ to: ROUTES.login, replace: true });
  };

  return (
    <AppShell title={LABELS.profile.title}>
      {isError ? (
        <div className="surface-card">
          <ErrorState onRetry={refetch} />
        </div>
      ) : isLoading || !student ? (
        <ProfileSkeleton />
      ) : (
        <div className="space-y-4">
          <SectionCard className="flex flex-col items-center py-7 text-center">
            <StudentAvatar
              name={student.fullName}
              photoUrl={student.photoUrl}
              className="size-24"
            />
            <h1 className="mt-4 font-display text-lg font-semibold text-foreground">
              {student.fullName}
            </h1>
            <p className="mt-1 text-xs text-muted-foreground">{formatClassSection(student)}</p>
            <div className="mt-3 flex items-center gap-2">
              <StatusBadge label={`Roll ${student.rollNumber}`} tone="primary" />
              <StatusBadge label={student.isActive ? "Active" : "Inactive"} tone="success" />
            </div>
          </SectionCard>

          <SectionCard delay={0.04}>
            <ProfileField
              label={LABELS.profile.admissionNumber}
              value={student.admissionNumber}
            />
            <Separator />
            <ProfileField
              label={LABELS.profile.classSection}
              value={formatClassSection(student)}
            />
            <Separator />
            <ProfileField
              label={LABELS.profile.parentName}
              value={parent?.fullName ?? session?.user.displayName ?? "—"}
            />
            <Separator />
            <ProfileField
              label={LABELS.profile.mobileNumber}
              value={parent?.mobileNumber ?? "—"}
            />
          </SectionCard>

          <SectionCard delay={0.06}>
            <ProfileAction
              icon={KeyRound}
              label={LABELS.profile.changePassword}
              onClick={() => toast.info("Password changes are handled by the school office.")}
            />
            <Separator />
            <ProfileAction
              icon={Phone}
              label={LABELS.profile.contactSchool}
              onClick={() => toast.info(`Call ${APP_CONFIG.supportPhone}`)}
            />
            <Separator />
            <ProfileAction
              icon={ShieldCheck}
              label={LABELS.profile.privacyPolicy}
              onClick={() => toast.info("Your data is visible only to you and the school office.")}
            />
            <Separator />
            <ProfileAction
              icon={Info}
              label={LABELS.profile.about}
              onClick={() =>
                toast.info(`${APP_CONFIG.appName} · Version ${APP_CONFIG.version}`)
              }
            />
            <Separator />
            <ProfileAction
              icon={LogOut}
              label={LABELS.profile.logout}
              danger
              onClick={() => void onLogout()}
            />
          </SectionCard>

          <p className="pt-2 text-center text-[11px] text-muted-foreground">
            {LABELS.brand.school} · {LABELS.brand.location}
          </p>
        </div>
      )}
    </AppShell>
  );
}
