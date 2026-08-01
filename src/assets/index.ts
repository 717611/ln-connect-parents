/**
 * Central asset map. Components import from here so real school photography can
 * replace these placeholders without touching any component.
 */
import attendancePlaceholder from "./attendance-placeholder.png";
import galleryPlaceholder from "./gallery-placeholder.jpg";
import loginSchoolAsset from "./login-school.jpg.asset.json";
import lnLogoAsset from "./ln-logo.png.asset.json";
import studentPlaceholder from "./student-placeholder.jpg";

export const ASSETS = {
  loginSchool: loginSchoolAsset.url,
  lnLogo: lnLogoAsset.url,
  studentPlaceholder,
  galleryPlaceholder,
  attendancePlaceholder,
} as const;

