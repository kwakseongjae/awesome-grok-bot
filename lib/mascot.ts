/**
 * Directory mascot swap hook.
 *
 * Change `id` + raster paths here. Components should import from this
 * module instead of hard-coding `/brand/mascot/…`. Keep files under
 * `public/brand/mascot/`.
 */
export const MASCOT = {
  id: "awesome",
  displayName: "Awesome",
  hostName: "Mr. Awesome",
  heroSrc: "/brand/mascot/awesome.png",
  markSrc: "/brand/mascot/awesome-mark.png",
} as const;

export type MascotId = typeof MASCOT.id;
