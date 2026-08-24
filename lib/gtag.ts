type GtagFn = (command: string, ...args: unknown[]) => void;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: GtagFn;
  }
}

export const event = (name: string, params?: Record<string, unknown>) => {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event: name, ...params });
  window.gtag?.("event", name, params);
};

export const lenBucket = (n: number) => {
  if (n === 0) return "0";
  if (n <= 5) return "1-5";
  if (n <= 15) return "6-15";
  if (n <= 30) return "16-30";
  if (n <= 60) return "31-60";
  if (n <= 120) return "61-120";
  return "121+";
};

export const countBucket = (n: number) => {
  if (n === 0) return "0";
  if (n <= 5) return "1-5";
  if (n <= 15) return "6-15";
  if (n <= 40) return "16-40";
  return "41+";
};
