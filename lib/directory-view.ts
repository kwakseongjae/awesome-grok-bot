import { CATEGORIES, type Category } from "@/lib/types";

export type DirectoryView = "table" | "cards";

export function parseDirectoryView(value: unknown): DirectoryView {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw === "cards" ? "cards" : "table";
}

export function parseDirectoryCategory(value: unknown): Category | "all" {
  const raw = Array.isArray(value) ? value[0] : value;
  if (typeof raw === "string" && (CATEGORIES as readonly string[]).includes(raw)) {
    return raw as Category;
  }
  return "all";
}

type DirectoryQuery = {
  view?: DirectoryView;
  category?: Category | "all";
};

export function directoryHref({ view, category }: DirectoryQuery = {}) {
  const query: { view?: "cards"; category?: Category } = {};
  if (view === "cards") query.view = "cards";
  if (category && category !== "all") query.category = category;
  if (Object.keys(query).length === 0) {
    return { pathname: "/" as const };
  }
  return { pathname: "/" as const, query };
}

export function directoryViewHref(view: DirectoryView) {
  return directoryHref({ view });
}
