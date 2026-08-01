import { useQuery } from "@tanstack/react-query";

import { APP_CONFIG } from "@/constants/config";
import { galleryService } from "@/services/galleryService";

import { queryKeys } from "./queryKeys";

export function useGalleryAlbums() {
  return useQuery({
    queryKey: queryKeys.galleryAlbums(),
    queryFn: () => galleryService.listAlbums(),
    staleTime: APP_CONFIG.queryStaleTimeMs,
  });
}

export function useGalleryPhotos(albumId: string | null) {
  return useQuery({
    queryKey: queryKeys.galleryPhotos(albumId),
    queryFn: () => galleryService.listPhotos(albumId),
    staleTime: APP_CONFIG.queryStaleTimeMs,
  });
}

export function useLatestGalleryPhotos(limit = 4) {
  return useQuery({
    queryKey: queryKeys.galleryLatest(limit),
    queryFn: () => galleryService.listLatestPhotos(limit),
    staleTime: APP_CONFIG.queryStaleTimeMs,
  });
}
