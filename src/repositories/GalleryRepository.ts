import { mockGalleryAlbums, mockGalleryPhotos } from "@/data/mockData";
import type { GalleryAlbum, GalleryPhoto } from "@/models";

import { byNewest, resolveMock } from "./repository.utils";

export interface IGalleryRepository {
  listAlbums(): Promise<GalleryAlbum[]>;
  listPhotos(albumId: string | null): Promise<GalleryPhoto[]>;
  listLatestPhotos(limit: number): Promise<GalleryPhoto[]>;
}

export const GalleryRepository: IGalleryRepository = {
  // TODO(firebase): collection(db, COLLECTIONS.gallery) album documents
  async listAlbums() {
    return resolveMock(mockGalleryAlbums);
  },

  // TODO(firebase): query(gallery photos, where("albumId", "==", albumId), orderBy("capturedAt", "desc"))
  async listPhotos(albumId) {
    const photos = albumId
      ? mockGalleryPhotos.filter((photo) => photo.albumId === albumId)
      : mockGalleryPhotos;
    return resolveMock(byNewest(photos, "capturedAt"));
  },

  // TODO(firebase): query(gallery photos, orderBy("capturedAt", "desc"), limit(limit))
  async listLatestPhotos(limit) {
    return resolveMock(byNewest(mockGalleryPhotos, "capturedAt").slice(0, limit));
  },
};
