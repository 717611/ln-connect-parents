/**
 * Central asset map. Components import from here so real school photography can
 * replace these placeholders without touching any component.
 */
import attendancePlaceholder from "./attendance-placeholder.png";
import galleryPlaceholder from "./gallery-placeholder.jpg";
import studentPlaceholder from "./student-placeholder.jpg";

/** Branding images are served from /public so any host (Vercel included) can load them. */
export const ASSETS = {
  loginSchool: "/login-school.jpg",
  lnLogo: "/ln-logo.png",
  studentPlaceholder,
  galleryPlaceholder,
  attendancePlaceholder,
} as const;

