import type { GalleryAlbum, GalleryPhoto } from "@/models";
import { GalleryRepository } from "@/repositories/GalleryRepository";

export const galleryService = {
  listAlbums(): Promise<GalleryAlbum[]> {
    return GalleryRepository.listAlbums();
  },
  listPhotos(albumId: string | null): Promise<GalleryPhoto[]> {
    return GalleryRepository.listPhotos(albumId);
  },
  listLatestPhotos(limit = 4): Promise<GalleryPhoto[]> {
    return GalleryRepository.listLatestPhotos(limit);
  },
};
