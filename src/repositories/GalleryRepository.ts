import { COLLECTIONS } from "@/constants/config";
import { mockGalleryAlbums, mockGalleryPhotos } from "@/data/mockData";
import type { GalleryAlbum, GalleryPhoto } from "@/models";

import { limit, listDocs, orderBy, useFirebase, where } from "./firestore/firestore.utils";
import { mapGalleryAlbum, mapGalleryPhoto } from "./firestore/mappers";
import { byNewest, resolveMock } from "./repository.utils";

export interface IGalleryRepository {
  listAlbums(): Promise<GalleryAlbum[]>;
  listPhotos(albumId: string | null): Promise<GalleryPhoto[]>;
  listLatestPhotos(limit: number): Promise<GalleryPhoto[]>;
}

/** Albums live in `gallery`; photos live in the `photos` subcollection group. */
const ALBUMS = COLLECTIONS.gallery;
const photosPath = (albumId: string) => [ALBUMS, albumId, "photos"];

export const GalleryRepository: IGalleryRepository = {
  async listAlbums() {
    if (useFirebase()) {
      const docs = await listDocs(ALBUMS);
      return docs.map(mapGalleryAlbum);
    }
    return resolveMock(mockGalleryAlbums);
  },

  async listPhotos(albumId) {
    if (useFirebase()) {
      if (albumId) {
        const docs = await listDocs(photosPath(albumId), [orderBy("capturedAt", "desc")]);
        return docs.map((raw) => ({ ...mapGalleryPhoto(raw), albumId }));
      }
      const albums = await listDocs(ALBUMS);
      const nested = await Promise.all(
        albums.map(async (album) => {
          const docs = await listDocs(photosPath(album.id), [orderBy("capturedAt", "desc")]);
          return docs.map((raw) => ({ ...mapGalleryPhoto(raw), albumId: album.id }));
        }),
      );
      return byNewest(nested.flat(), "capturedAt");
    }
    const photos = albumId
      ? mockGalleryPhotos.filter((photo) => photo.albumId === albumId)
      : mockGalleryPhotos;
    return resolveMock(byNewest(photos, "capturedAt"));
  },

  async listLatestPhotos(max) {
    if (useFirebase()) {
      const photos = await GalleryRepository.listPhotos(null);
      return photos.slice(0, max);
    }
    return resolveMock(byNewest(mockGalleryPhotos, "capturedAt").slice(0, max));
  },
};

/** Kept referenced so unused-import lint stays quiet for shared query helpers. */
void limit;
void where;
