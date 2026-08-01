import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function CardSkeleton({ className }: { className?: string | undefined }) {
  return (
    <div className={cn("surface-card space-y-3 p-5", className)}>
      <div className="flex items-center gap-3">
        <Skeleton className="size-11 rounded-2xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3.5 w-1/3" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-4/5" />
    </div>
  );
}

export function ListSkeleton({ count = 3, className }: { count?: number | undefined; className?: string | undefined }) {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: count }).map((_, index) => (
        <CardSkeleton key={index} />
      ))}
    </div>
  );
}

export function TimelineSkeleton({ count = 3 }: { count?: number | undefined }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex items-start gap-3">
          <Skeleton className="size-9 rounded-xl" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3.5 w-2/5" />
            <Skeleton className="h-3 w-3/5" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="space-y-4">
      <div className="surface-card flex flex-col items-center gap-3 p-6">
        <Skeleton className="size-24 rounded-full" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-24" />
      </div>
      <div className="surface-card space-y-4 p-5">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="space-y-2">
            <Skeleton className="h-2.5 w-24" />
            <Skeleton className="h-3.5 w-40" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function GallerySkeleton({ count = 6 }: { count?: number | undefined }) {
  return (
    <div className="columns-2 gap-3 sm:columns-3">
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton
          key={index}
          className={cn("mb-3 w-full rounded-2xl", index % 3 === 1 ? "h-56" : "h-36")}
        />
      ))}
    </div>
  );
}

export function ComplaintThreadSkeleton({ count = 4 }: { count?: number | undefined }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={cn("flex", index % 2 === 0 ? "justify-start" : "justify-end")}>
          <Skeleton className={cn("h-16 rounded-2xl", index % 2 === 0 ? "w-3/5" : "w-2/5")} />
        </div>
      ))}
    </div>
  );
}
