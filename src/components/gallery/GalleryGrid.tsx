import { motion } from "motion/react";

import { ASSETS } from "@/assets";
import { MOTION } from "@/constants/theme";
import { cn } from "@/lib/utils";
import type { GalleryPhoto } from "@/models";

const ASPECT_CLASS: Record<GalleryPhoto["aspect"], string> = {
  portrait: "aspect-[3/4]",
  landscape: "aspect-[4/3]",
  square: "aspect-square",
};

export function GalleryGrid({
  photos,
  onSelect,
}: {
  photos: GalleryPhoto[];
  onSelect?: ((photo: GalleryPhoto) => void) | undefined;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {photos.map((photo, index) => (
        <motion.button
          key={photo.id}
          type="button"
          onClick={() => onSelect?.(photo)}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: MOTION.base, ease: MOTION.ease, delay: index * 0.03 }}
          className={cn(
            "group relative overflow-hidden rounded-2xl bg-muted shadow-[var(--shadow-card)]",
            ASPECT_CLASS[photo.aspect],
          )}
        >
          <img
            src={photo.imageUrl || ASSETS.galleryPlaceholder}
            alt={photo.title}
            loading="lazy"
            width={480}
            height={480}
            className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-secondary/85 to-transparent p-2.5 text-left text-[11px] font-semibold text-secondary-foreground">
            {photo.title}
          </span>
        </motion.button>
      ))}
    </div>
  );
}
