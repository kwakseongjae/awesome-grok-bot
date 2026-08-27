export const oneLine = (value: unknown, max: number) => {
  if (typeof value !== "string") return null;
  const text = value.replace(/\s+/g, " ").trim();
  if (!text || text.length > max) return null;
  if (/[<>]/.test(text)) return null;
  return text;
};

export const todayStamp = () => {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  const day = String(now.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const isHoneypotFilled = (value: unknown) =>
  typeof value === "string" && value.trim().length > 0;
