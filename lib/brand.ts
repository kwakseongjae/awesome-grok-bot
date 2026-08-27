/**
 * Header / mark swap slot.
 * Change `src` / `file` and drop the matching file under `public/brand/mascot/`
 * to replace the logo. Do not scatter mark paths in components.
 */
export const BRAND_MARK_DIR = "public/brand/mascot" as const;
export const BRAND_MARK_FILE = "awesome-mark.png" as const;

export const BRAND_MARK = {
  src: `/brand/mascot/${BRAND_MARK_FILE}`,
  alt: "Awesome",
  width: 32,
} as const;
