/**
 * Central asset map. Components import from here so real school photography can
 * replace these placeholders without touching any component.
 */
import attendancePlaceholder from "./attendance-placeholder.png";
import galleryPlaceholder from "./gallery-placeholder.jpg";
import loginSchool from "./login-school.jpg";
import lnLogo from "./ln-logo.png";
import studentPlaceholder from "./student-placeholder.jpg";

export const ASSETS = {
  loginSchool,
  lnLogo,
  studentPlaceholder,
  galleryPlaceholder,
  attendancePlaceholder,
} as const;
