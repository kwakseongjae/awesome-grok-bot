export type DirectoryView = "table" | "cards";

export function parseDirectoryView(value: unknown): DirectoryView {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw === "cards" ? "cards" : "table";
}

export function directoryViewHref(view: DirectoryView) {
  if (view === "cards") {
    return { pathname: "/" as const, query: { view: "cards" as const } };
  }
  return { pathname: "/" as const };
}
