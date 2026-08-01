import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { initials } from "@/lib/format";
import { cn } from "@/lib/utils";

interface StudentAvatarProps {
  name: string;
  photoUrl?: string | null;
  className?: string;
  ring?: boolean;
}

export function StudentAvatar({ name, photoUrl, className, ring = true }: StudentAvatarProps) {
  return (
    <Avatar
      className={cn(
        "size-12",
        ring && "ring-2 ring-primary/60 ring-offset-2 ring-offset-card",
        className,
      )}
    >
      {photoUrl ? <AvatarImage src={photoUrl} alt={name} loading="lazy" /> : null}
      <AvatarFallback className="bg-secondary-soft font-display text-sm font-semibold text-secondary">
        {initials(name)}
      </AvatarFallback>
    </Avatar>
  );
}
