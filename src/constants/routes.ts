/**
 * Canonical application routes.
 * Never hardcode a path string in a component — import from here.
 */
export const ROUTES = {
  login: "/",
  home: "/home",
  work: "/work",
  notices: "/notices",
  attendance: "/attendance",
  gallery: "/gallery",
  complaints: "/complaints",
  complaintDetail: "/complaints/$complaintId",
  profile: "/profile",
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RoutePath = (typeof ROUTES)[RouteKey];
