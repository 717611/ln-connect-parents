import { createFileRoute } from "@tanstack/react-router";
import { Images } from "lucide-react";
import { useState } from "react";

import { EmptyState } from "@/components/feedback/EmptyState";
import { GallerySkeleton } from "@/components/feedback/skeletons";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { AppShell } from "@/components/layout/AppShell";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { LABELS } from "@/constants/labels";
import { useGalleryAlbums, useGalleryPhotos } from "@/hooks/useGallery";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { GalleryPhoto } from "@/models";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery | LN Parent Portal" },
      {
        name: "description",
        content:
          "Photographs from school events, classroom activities and celebrations at LN International School, Ranchi.",
      },
      { property: "og:title", content: "Gallery — LN Parent Portal" },
      {
        property: "og:description",
        content: "Event and classroom photographs shared by the school.",
      },
    ],
  }),
  component: GalleryRoute,
});

function GalleryRoute() {
  const [albumId, setAlbumId] = useState<string | null>(null);
  const [selected, setSelected] = useState<GalleryPhoto | null>(null);

  const albumsQuery = useGalleryAlbums();
  const photosQuery = useGalleryPhotos(albumId);
  const albums = albumsQuery.data ?? [];
  const photos = photosQuery.data ?? [];

  return (
    <AppShell title={LABELS.gallery.title} showBack>
      <div className="space-y-4">
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
          <FilterChip
            label={LABELS.gallery.all}
            isActive={albumId === null}
            onClick={() => setAlbumId(null)}
          />
          {albums.map((album) => (
            <FilterChip
              key={album.id}
              label={album.name}
              isActive={albumId === album.id}
              onClick={() => setAlbumId(album.id)}
            />
          ))}
        </div>

        {photosQuery.isPending ? (
          <GallerySkeleton />
        ) : photos.length === 0 ? (
          <div className="surface-card">
            <EmptyState
              icon={Images}
              title={LABELS.gallery.emptyTitle}
              body={LABELS.gallery.emptyBody}
            />
          </div>
        ) : (
          <GalleryGrid photos={photos} onSelect={setSelected} />
        )}
      </div>

      <Dialog open={selected !== null} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-md overflow-hidden rounded-3xl p-0">
          {selected ? (
            <>
              <DialogTitle className="sr-only">{selected.title}</DialogTitle>
              <img
                src={selected.imageUrl}
                alt={selected.title}
                className="max-h-[70vh] w-full object-cover"
              />
              <div className="p-5">
                <p className="text-sm font-semibold text-foreground">{selected.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {formatDate(selected.capturedAt)}
                </p>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}

function FilterChip({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-colors",
        isActive
          ? "bg-primary text-primary-foreground shadow-[var(--shadow-glow)]"
          : "bg-card text-muted-foreground shadow-[var(--shadow-card)]",
      )}
    >
      {label}
    </button>
  );
}
