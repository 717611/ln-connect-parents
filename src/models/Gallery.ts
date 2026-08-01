import type { IsoDateTime } from "./common";

export type GalleryAlbumKind = "events" | "activities" | "classroom";

export interface GalleryPhoto {
  id: string;
  albumId: string;
  title: string;
  imageUrl: string;
  capturedAt: IsoDateTime;
  aspect: "portrait" | "landscape" | "square";
}

export interface GalleryAlbum {
  id: string;
  name: string;
  kind: GalleryAlbumKind;
  coverPhotoId: string;
  photoCount: number;
}
